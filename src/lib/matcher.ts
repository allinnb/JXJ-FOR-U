import { MOCK_INTERNAL_DISCLAIMER } from "@/src/lib/config";
import { mockScholarships } from "@/src/lib/mockScholarships";
import type { LeadQuality, MatchLevel, MatchResult, Scholarship, UserProfile } from "@/src/types";

const REPORT_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function createReportId() {
  const code = Array.from({ length: 6 }, () => REPORT_CHARS[Math.floor(Math.random() * REPORT_CHARS.length)]).join("");
  return `SCH-2026-${code}`;
}

function parseScore(gpa: string): number {
  const matched = gpa.match(/\d+(\.\d+)?/);
  if (!matched) return 0;
  const value = Number(matched[0]);
  if (value <= 4.5) return Math.min(100, (value / 4) * 100);
  return Math.min(100, value);
}

function inferMatchLevel(score: number): MatchLevel {
  if (score >= 78) return "high";
  if (score >= 58) return "medium";
  return "low";
}

function inferLeadQuality(profile: UserProfile, matchLevel: MatchLevel, score: number): {
  leadQuality: LeadQuality;
  recommendedFollowUp: string;
  recommendedServicePackage: string;
} {
  const hasWechat = profile.wechat.trim().length > 0;
  const needsConsulting = profile.needsConsulting === "是";
  const urgentIntake = /2026|2027|Fall|Spring|秋|春/i.test(profile.intakeTime);

  if (hasWechat && needsConsulting && (matchLevel === "high" || score >= 76)) {
    return {
      leadQuality: "hot",
      recommendedFollowUp: "建议 24 小时内添加微信，优先做官网核验、机会池扩展和申请策略沟通。",
      recommendedServicePackage: "¥699 人工复核 + 申请策略咨询",
    };
  }

  if (hasWechat || needsConsulting || urgentIntake || matchLevel === "medium") {
    return {
      leadQuality: "warm",
      recommendedFollowUp: "建议 48 小时内发送完整报告样例，引导补充成绩单、简历和目标院校清单。",
      recommendedServicePackage: "¥99 完整 AI 奖学金报告",
    };
  }

  return {
    leadQuality: "cold",
    recommendedFollowUp: "建议先发送免费测评结果和奖学金科普内容，等待用户明确目标国家或入学时间后再跟进。",
    recommendedServicePackage: "免费简版报告 + 后续内容培育",
  };
}

function scholarshipMatchesTarget(item: Scholarship, profile: UserProfile) {
  const degreeLevels = Array.isArray(item.degreeLevel) ? item.degreeLevel : [item.degreeLevel];
  const degreeMatched = degreeLevels.includes(profile.targetDegree) || String(item.degreeLevel).includes(profile.targetDegree);
  const target = profile.targetCountry.toLowerCase();
  const countryMatched = item.country.toLowerCase().includes(target) || target.includes(item.country.toLowerCase()) || item.country.includes("多国") || item.country.includes("欧洲");
  const typeMatched = profile.scholarshipPreference === "都可以" || item.scholarshipType === profile.scholarshipPreference;

  return { degreeMatched, countryMatched, typeMatched };
}

function rankScholarships(profile: UserProfile) {
  return [...mockScholarships]
    .sort((a, b) => {
      const aMatch = scholarshipMatchesTarget(a, profile);
      const bMatch = scholarshipMatchesTarget(b, profile);
      const aScore = Number(aMatch.degreeMatched) * 3 + Number(aMatch.countryMatched) * 2 + Number(aMatch.typeMatched) + a.aiConfidence / 100;
      const bScore = Number(bMatch.degreeMatched) * 3 + Number(bMatch.countryMatched) * 2 + Number(bMatch.typeMatched) + b.aiConfidence / 100;
      return bScore - aScore;
    })
    .slice(0, 3);
}

export function matchScholarships(userProfile: UserProfile): MatchResult {
  try {
    const academicScore = parseScore(userProfile.gpa);
    let score = 45;

    if (academicScore >= 88) score += 18;
    else if (academicScore >= 80) score += 12;
    else if (academicScore >= 75) score += 6;
    else score -= 8;

    if (["985", "211", "海外院校", "国际学校"].includes(userProfile.schoolBackground)) score += 10;
    if (userProfile.languageScore.trim().length >= 4) score += 8;
    if (userProfile.experiences.trim().length >= 20) score += 10;
    if (userProfile.acceptsNonPopular === "是") score += 8;
    if (["全奖", "半奖"].includes(userProfile.scholarshipPreference) && /低|有限|紧张|20/i.test(userProfile.budget)) score -= 4;
    if (userProfile.needsConsulting === "是") score += 3;

    const matchScore = Math.max(30, Math.min(96, score));
    const matchLevel = inferMatchLevel(matchScore);
    const leadMeta = inferLeadQuality(userProfile, matchLevel, matchScore);
    const recommendedScholarships = rankScholarships(userProfile);
    const recommendedCountries = Array.from(new Set(recommendedScholarships.map((item) => item.country))).slice(0, 3);

    return {
      reportId: createReportId(),
      createdAt: new Date().toISOString(),
      matchLevel,
      matchScore,
      leadQuality: leadMeta.leadQuality,
      recommendedScholarships,
      recommendedCountries,
      risks: [
        academicScore < 80 ? "当前 GPA/均分竞争力可能不足，建议同步选择保底型奖学金。" : "需要核验 GPA 换算口径，避免与院校官方要求不一致。",
        userProfile.languageScore.trim() ? "语言成绩有效期和小分要求需要逐个项目确认。" : "暂未填写明确语言成绩，可能影响奖学金初筛判断。",
        "mock 结果和规则初筛仅供内部测试，正式申请前必须官网核验和人工复核。",
      ],
      nextSteps: [
        "整理成绩单、语言成绩、简历和核心经历清单，建立奖学金申请素材库。",
        "按目标国家与入学时间核验截止日期，优先锁定 10–20 个可申请机会。",
        "将报告发给顾问，由顾问在飞书工作台中复核来源、资格和跟进状态。",
      ],
      reportStatus: "draft_mock",
      recommendedFollowUp: leadMeta.recommendedFollowUp,
      recommendedServicePackage: leadMeta.recommendedServicePackage,
      disclaimer: MOCK_INTERNAL_DISCLAIMER,
    };
  } catch (error) {
    console.warn("Failed to match scholarships, fallback to safe default", error);
    const fallbackScholarships = mockScholarships.slice(0, 3);
    return {
      reportId: createReportId(),
      createdAt: new Date().toISOString(),
      matchLevel: "medium",
      matchScore: 50,
      leadQuality: "warm",
      recommendedScholarships: fallbackScholarships,
      recommendedCountries: Array.from(new Set(fallbackScholarships.map((item) => item.country))).slice(0, 3),
      risks: ["系统暂时无法完整解析你的背景，建议重新测评或联系顾问人工复核。"],
      nextSteps: ["补充目标国家、GPA、语言成绩和预算信息。", "联系顾问核验官网来源、资格要求和截止日期。"],
      reportStatus: "draft_mock",
      recommendedFollowUp: "建议由顾问人工确认用户信息是否完整，再补充生成奖学金机会池。",
      recommendedServicePackage: "¥99 完整 AI 奖学金报告",
      disclaimer: MOCK_INTERNAL_DISCLAIMER,
    };
  }
}
