"use client";

import { useEffect, useMemo, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import type { AssessmentFormData, MatchResult, ReportMeta } from "@/types";

interface CopyConsultationButtonProps {
  form: AssessmentFormData;
  result: MatchResult;
  reportMeta: ReportMeta;
  mode?: "consultation" | "summary";
}

const STORAGE_KEY = "scholarshipAssessmentLead";

function normalizeStoredLead(value: unknown): Partial<AssessmentFormData> {
  if (!value || typeof value !== "object") {
    return {};
  }

  return value as Partial<AssessmentFormData>;
}

export function CopyConsultationButton({ form, result, reportMeta, mode = "consultation" }: CopyConsultationButtonProps) {
  const [storedLead, setStoredLead] = useState<Partial<AssessmentFormData>>({});
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    try {
      const rawLead = localStorage.getItem(STORAGE_KEY);
      if (!rawLead) return;
      setStoredLead(normalizeStoredLead(JSON.parse(rawLead)));
    } catch (error) {
      console.warn("Failed to read assessment lead from localStorage", error);
    }
  }, []);

  const lead = useMemo(() => ({ ...form, ...storedLead }), [form, storedLead]);

  const consultationText = useMemo(
    () =>
      [
        "您好，我刚完成了 AI 留学奖学金匹配测评，想请顾问帮我做人工复核。",
        "",
        `报告编号：${reportMeta.reportId}`,
        `生成时间：${reportMeta.generatedAt}`,
        `当前学历：${lead.currentEducation}`,
        `目标学历：${lead.targetDegree}`,
        `目标国家：${lead.targetCountries}`,
        `专业方向：${lead.majorDirection}`,
        `GPA/均分：${lead.gpa}`,
        `语言成绩：${lead.languageScore}`,
        `家庭预算：${lead.familyBudget}`,
        `奖学金偏好：${lead.scholarshipPreference}`,
        `系统匹配等级：${result.matchLevel}`,
        `整体匹配分：${result.overallMatchScore}/100`,
        "",
        "以下信息为顾问内部跟进参考，请不要直接转发给学生：",
        `线索等级：${result.leadQuality}`,
        `推荐跟进方式：${result.recommendedFollowUp}`,
        `适合推荐的服务套餐：${result.recommendedServicePackage}`,
      ].join("\n"),
    [lead, reportMeta, result],
  );

  const reportSummaryText = useMemo(
    () =>
      [
        `AI 留学奖学金匹配简版报告（${reportMeta.reportId}）`,
        `生成时间：${reportMeta.generatedAt}`,
        `目标：${lead.targetDegree} · ${lead.targetCountries} · ${lead.majorDirection}`,
        `整体匹配评级：${result.matchLevel}`,
        `整体匹配分：${result.overallMatchScore}/100`,
        `推荐国家方向：${result.recommendedCountries.join("、") || "待进一步确认"}`,
        "",
        "初筛奖学金机会：",
        ...result.recommendedScholarships.map((item, index) => `${index + 1}. ${item.name}｜${item.country}｜${item.type}｜AI 置信度 ${item.aiConfidence}%`),
        "",
        "重要提示：AI 结果仅供参考，以官网和人工复核为准。",
      ].join("\n"),
    [lead, reportMeta, result],
  );

  const isSummary = mode === "summary";
  const copyText = isSummary ? reportSummaryText : consultationText;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(copyText);
      trackEvent("click_copy_consultation", {
        reportId: reportMeta.reportId,
        mode,
        leadQuality: result.leadQuality,
      });
      setCopyStatus("copied");
      window.setTimeout(() => setCopyStatus("idle"), 2200);
    } catch (error) {
      console.warn("Failed to copy consultation text", error);
      setCopyStatus("failed");
    }
  }

  return (
    <div className="relative rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100 md:p-7">
      <p className="text-sm font-black text-brand-600">{isSummary ? "Report Summary" : "Lead Capture"}</p>
      <h2 className="mt-1 text-xl font-black text-slate-950">{isSummary ? "复制报告摘要" : "复制给顾问"}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        {isSummary ? "一键复制简版报告摘要，方便保存、转发或后续做人工复核。" : "复制一段自然语言咨询文本，用户可直接粘贴发给顾问微信；其中包含顾问内部跟进信息。"}
      </p>
      <div className="mt-4 max-h-64 overflow-auto rounded-2xl bg-slate-50 p-4 text-xs leading-6 text-slate-600 ring-1 ring-slate-100">
        <pre className="whitespace-pre-wrap font-sans">{copyText}</pre>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        className="mt-5 w-full rounded-2xl bg-brand-600 px-5 py-4 text-sm font-black text-white shadow-lg shadow-blue-100 transition hover:-translate-y-0.5 hover:bg-brand-700"
      >
        {copyStatus === "copied" ? "已复制" : isSummary ? "复制报告摘要" : "复制给顾问"}
      </button>
      {copyStatus === "failed" ? (
        <p className="mt-3 text-xs leading-5 text-rose-600">复制失败，请手动选中文本复制。</p>
      ) : null}
      {copyStatus === "copied" ? (
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-soft">
          复制成功，可发送给顾问微信
        </div>
      ) : null}
    </div>
  );
}
