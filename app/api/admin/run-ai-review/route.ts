import { NextResponse } from "next/server";
import { extractScholarshipFields } from "@/src/lib/ai/extractScholarshipFields";
import { getExaContents } from "@/src/lib/ai/exa";
import { generateSearchQueries } from "@/src/lib/ai/generateSearchQueries";
import { getOpenRouterModels } from "@/src/lib/ai/openrouter";
import { scoreScholarshipMatch } from "@/src/lib/ai/scoreScholarshipMatch";
import { searchScholarshipWeb } from "@/src/lib/ai/searchScholarshipWeb";
import { createAIRunRecord } from "@/src/lib/feishu/aiRuns";
import { createScholarshipRecords } from "@/src/lib/feishu/scholarships";
import type { AIRunRecord, Scholarship, UserProfile } from "@/src/types";

function createRunId() {
  return `AIRUN-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

async function safeSaveRun(record: AIRunRecord) {
  try {
    await createAIRunRecord(record);
  } catch (error) {
    console.error("[api/admin/run-ai-review] failed to save AI run", error);
  }
}

function normalizeSourceType(value: unknown): Scholarship["sourceType"] {
  const allowed: Scholarship["sourceType"][] = ["university", "government", "foundation", "international_org", "third_party", "unknown"];
  return typeof value === "string" && allowed.includes(value as Scholarship["sourceType"]) ? (value as Scholarship["sourceType"]) : "unknown";
}

function normalizeSourceReliability(value: unknown, sourceType: Scholarship["sourceType"]): Scholarship["sourceReliability"] {
  const allowed: Scholarship["sourceReliability"][] = ["high", "medium", "low"];
  if (sourceType === "third_party") return "medium";
  return typeof value === "string" && allowed.includes(value as Scholarship["sourceReliability"]) ? (value as Scholarship["sourceReliability"]) : "medium";
}

function normalizeText(value: unknown, fallback = "待确认") {
  if (Array.isArray(value)) return value.filter(Boolean).join(" / ") || fallback;
  if (typeof value === "string") return value || fallback;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return fallback;
}

export async function POST(request: Request) {
  // Admin API key authentication
  const adminKey = process.env.ADMIN_API_KEY;
  if (adminKey) {
    const providedKey = request.headers.get("x-admin-key") || "";
    if (providedKey !== adminKey) {
      return NextResponse.json({ success: false, error: "无效的管理员密钥。" }, { status: 401 });
    }
  }

  const runId = createRunId();
  const createdAt = new Date().toISOString();
  const models = getOpenRouterModels();
  let reportId = "unknown";
  let exaSearchCount = 0;
  let processedUrlCount = 0;

  try {
    const body = (await request.json()) as { reportId?: string; userProfile?: UserProfile };
    const userProfile = body.userProfile;
    if (!body.reportId || !userProfile) {
      return NextResponse.json({ success: false, error: "请求缺少 reportId 或 userProfile。", candidates: [] }, { status: 400 });
    }

    reportId = body.reportId;
    const queries = await generateSearchQueries(userProfile);
    exaSearchCount = queries.length;
    const urls = await searchScholarshipWeb(queries);
    processedUrlCount = urls.length;
    const contents = await getExaContents(urls);

    const candidates: Scholarship[] = [];
    const extractionErrors: string[] = [];
    for (const content of contents.slice(0, 6)) {
      try {
        const extracted = await extractScholarshipFields({ url: content.url, title: content.title, text: content.text || content.snippet || "" }, userProfile);
        if (!extracted) continue;
        let scored: { score?: number; matchReason?: string; risks?: string; requiresHumanReview?: boolean } = {};
        try {
          scored = await scoreScholarshipMatch(userProfile, extracted);
        } catch (scoreError) {
          console.error("[api/admin/run-ai-review] score failed, using extraction fallback", scoreError);
          extractionErrors.push(scoreError instanceof Error ? scoreError.message : "score failed");
        }
        const sourceType = normalizeSourceType(extracted.sourceType);
        candidates.push({
          id: normalizeText(extracted.id, `ai-${candidates.length + 1}`),
          name: normalizeText(extracted.name, "待确认奖学金"),
          country: normalizeText(extracted.country, userProfile.targetCountry),
          institution: normalizeText(extracted.institution, "待确认机构"),
          degreeLevel: normalizeText(extracted.degreeLevel, userProfile.targetDegree),
          scholarshipType: normalizeText(extracted.scholarshipType, "都可以"),
          amount: normalizeText(extracted.amount, "待确认"),
          deadline: normalizeText(extracted.deadline, "待确认"),
          officialUrl: normalizeText(extracted.officialUrl, content.url),
          sourceType,
          sourceReliability: normalizeSourceReliability(extracted.sourceReliability, sourceType),
          aiConfidence: Math.min(95, Math.max(40, scored.score || extracted.aiConfidence || 60)),
          matchReason: normalizeText(scored.matchReason || extracted.matchReason, "AI 初步判断与用户目标方向相关。"),
          risks: normalizeText(scored.risks || extracted.risks, "资格和截止日期需要人工复核。"),
          requiresHumanReview: scored.requiresHumanReview ?? extracted.requiresHumanReview ?? true,
          lastVerifiedAt: new Date().toISOString().slice(0, 10),
          evidence: extracted.evidence,
        });
      } catch (extractError) {
        console.error("[api/admin/run-ai-review] extract failed, skip one content", extractError);
        extractionErrors.push(extractError instanceof Error ? extractError.message : "extract failed");
      }
      if (candidates.length >= 4) break;
    }

    if (candidates.length === 0 && contents.length > 0) {
      contents.slice(0, 3).forEach((content, index) => {
        candidates.push({
          id: `exa-fallback-${index + 1}`,
          name: content.title || "待人工确认的奖学金机会",
          country: userProfile.targetCountry,
          institution: "待确认机构",
          degreeLevel: userProfile.targetDegree,
          scholarshipType: userProfile.scholarshipPreference || "都可以",
          amount: "待确认",
          deadline: "待确认",
          officialUrl: content.url,
          sourceType: "unknown",
          sourceReliability: "medium",
          aiConfidence: 45,
          matchReason: "Exa 搜索命中与用户目标国家、学历或奖学金关键词相关的页面，需顾问进一步核验。",
          risks: "AI 字段抽取未稳定完成；金额、资格和截止日期必须人工核验。",
          requiresHumanReview: true,
          lastVerifiedAt: new Date().toISOString().slice(0, 10),
          evidence: {
            sourceTitle: content.title || "待确认页面",
            sourceSnippet: content.snippet || "",
            sourceTextExcerpt: (content.text || content.snippet || "").slice(0, 500),
            deadlineRawText: "待确认",
            eligibilityRawText: "待确认",
            lastFetchedAt: new Date().toISOString(),
          },
        });
      });
    }

    if (candidates.length === 0 && extractionErrors.length > 0) {
      console.error("[api/admin/run-ai-review] no candidates extracted", extractionErrors.slice(0, 3));
    }

    await safeSaveRun({
      runId,
      reportId,
      createdAt,
      runType: "manual_ai_review",
      modelFast: models.fast,
      modelStrong: models.strong,
      exaSearchCount,
      processedUrlCount,
      success: true,
      errorMessage: "",
    });

    // 将 AI 复核结果写入飞书 Scholarships 表
    let feishuWriteSuccess = false;
    if (candidates.length > 0) {
      try {
        await createScholarshipRecords(reportId, candidates);
        feishuWriteSuccess = true;
      } catch (writeErr) {
        console.error("[api/admin/run-ai-review] AI 复核结果写入飞书 Scholarships 表失败:", writeErr);
      }
    }

    return NextResponse.json({ success: true, runId, reportId, queries, candidates, feishuWriteSuccess });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "AI 复核运行失败";
    console.error("[api/admin/run-ai-review] failed", error);
    await safeSaveRun({
      runId,
      reportId,
      createdAt,
      runType: "manual_ai_review",
      modelFast: models.fast,
      modelStrong: models.strong,
      exaSearchCount,
      processedUrlCount,
      success: false,
      errorMessage,
    });

    return NextResponse.json({ success: false, runId, reportId, error: errorMessage, candidates: [] }, { status: 200 });
  }
}
