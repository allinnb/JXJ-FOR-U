import { mockScholarships } from "@/lib/mockScholarships";
import type { AssessmentFormData, MatchLevel, MatchResult, Scholarship } from "@/types";

function parseScore(gpa: string): number {
  const matched = gpa.match(/\d+(\.\d+)?/);
  if (!matched) return 0;
  const value = Number(matched[0]);
  if (value <= 4.5) return (value / 4) * 100;
  return value;
}

function inferMatchLevel(score: number): MatchLevel {
  if (score >= 78) return "高";
  if (score >= 58) return "中";
  return "低";
}

function countryMatches(scholarship: Scholarship, targetCountries: string): boolean {
  const target = targetCountries.toLowerCase();
  return scholarship.country.toLowerCase().includes(target) || target.includes(scholarship.country.toLowerCase()) || scholarship.country.includes("多国") || scholarship.country.includes("非热门");
}

function inferLeadQuality(form: AssessmentFormData, matchLevel: MatchLevel, score: number) {
  const hasContact = form.wechat.trim().length > 0 || form.email.trim().length > 0;
  const needsConsulting = form.needConsulting === "是";
  const isUrgent = /2026|Fall|Spring|秋|春/i.test(form.intakeTime);

  if (hasContact && needsConsulting && (matchLevel === "高" || score >= 75)) {
    return {
      leadQuality: "hot" as const,
      recommendedFollowUp: "建议 24 小时内由顾问添加微信，优先做官网核验和奖学金机会池扩展。",
      recommendedServicePackage: "¥699 人工复核 + 申请策略咨询",
    };
  }

  if (hasContact && (needsConsulting || isUrgent || matchLevel === "中")) {
    return {
      leadQuality: "warm" as const,
      recommendedFollowUp: "建议 48 小时内发送完整报告样例，引导补充成绩单、简历和目标院校清单。",
      recommendedServicePackage: "¥99 完整 AI 奖学金报告",
    };
  }

  return {
    leadQuality: "cold" as const,
    recommendedFollowUp: "建议先发送免费测评结果和奖学金科普内容，等待用户明确目标国家或入学时间后再跟进。",
    recommendedServicePackage: "免费简版报告 + 后续内容培育",
  };
}

export function matchScholarships(form: AssessmentFormData): MatchResult {
  try {
    const academicScore = parseScore(form.gpa);
    let score = 45;

  if (academicScore >= 88 || academicScore >= 3.6 * 25) score += 18;
  else if (academicScore >= 80) score += 12;
  else if (academicScore >= 75) score += 6;
  else score -= 8;

  if (["985", "211", "海外院校", "国际学校"].includes(form.schoolBackground)) score += 10;
  if (form.languageScore.trim().length >= 4) score += 8;
  if (form.experiences.trim().length >= 20) score += 10;
  if (form.acceptNonPopular === "是") score += 8;
  if (["全奖", "半奖"].includes(form.scholarshipPreference) && form.familyBudget.includes("低")) score -= 5;
  if (form.needConsulting === "是") score += 3;

  const recommendedScholarships = mockScholarships
    .filter((item) => item.degreeLevels.includes(form.targetDegree))
    .sort((a, b) => {
      const aCountry = countryMatches(a, form.targetCountries) ? 1 : 0;
      const bCountry = countryMatches(b, form.targetCountries) ? 1 : 0;
      const aType = a.type === form.scholarshipPreference || form.scholarshipPreference === "都可以" ? 1 : 0;
      const bType = b.type === form.scholarshipPreference || form.scholarshipPreference === "都可以" ? 1 : 0;
      const aMajor = a.suitableMajors.some((major) => form.majorDirection.includes(major) || major.includes(form.majorDirection)) ? 1 : 0;
      const bMajor = b.suitableMajors.some((major) => form.majorDirection.includes(major) || major.includes(form.majorDirection)) ? 1 : 0;
      return bCountry + bType + bMajor - (aCountry + aType + aMajor);
    })
    .slice(0, 3);

  const boundedScore = Math.max(30, Math.min(96, score));
  const recommendedCountries = Array.from(new Set(recommendedScholarships.map((item) => item.country))).slice(0, 3);

  const risks = [
    academicScore < 80 ? "当前 GPA/均分竞争力可能不足，建议同步选择保底型奖学金。" : "需要核验 GPA 换算口径，避免与院校官方要求不一致。",
    form.languageScore.trim() ? "语言成绩有效期和小分要求需要逐个项目确认。" : "暂未填写明确语言成绩，可能影响奖学金初筛判断。",
    form.scholarshipPreference === "全奖" ? "全奖竞争通常显著高于学费减免，需要扩大国家与院校池。" : "不同奖学金覆盖范围差异大，需确认是否覆盖生活费、保险和住宿。",
  ];

  const nextSteps = [
    "整理成绩单、语言成绩、简历和核心经历清单，建立奖学金申请素材库。",
    "按目标国家与入学时间核验截止日期，优先锁定 10–20 个可申请机会。",
    "对高匹配项目做人工复核，确认官网链接、资格条件和材料清单。",
  ];

    const matchLevel = inferMatchLevel(boundedScore);
    const leadMeta = inferLeadQuality(form, matchLevel, boundedScore);

    return {
      overallMatchScore: boundedScore,
      matchLevel,
      recommendedCountries,
      recommendedScholarships,
      risks,
      nextSteps,
      ...leadMeta,
    };
  } catch (error) {
    console.warn("Failed to match scholarships, fallback to safe default", error);

    return {
      overallMatchScore: 50,
      matchLevel: "中",
      recommendedCountries: ["多国方向"],
      recommendedScholarships: mockScholarships.slice(0, 3),
      risks: ["系统暂时无法完整解析你的背景，建议重新测评或联系顾问人工复核。"],
      nextSteps: ["补充目标国家、GPA、语言成绩和预算信息。", "联系顾问核验官网来源、资格要求和截止日期。"],
      leadQuality: "warm",
      recommendedFollowUp: "建议由顾问人工确认用户信息是否完整，再补充生成奖学金机会池。",
      recommendedServicePackage: "¥99 完整 AI 奖学金报告",
    };
  }
}
