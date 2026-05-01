import { listBitableRecords } from "@/src/lib/feishu/client";
import { FEISHU_LEADS_FIELDS, FEISHU_SCHOLARSHIP_FIELDS } from "@/src/lib/feishu/fieldMap";

type FeishuFields = Record<string, unknown>;

export type FullReportLead = {
  reportId: string;
  createdAt: string;
  wechat: string;
  email: string;
  currentEducation: string;
  targetDegree: string;
  targetCountry: string;
  targetMajor: string;
  intakeTime: string;
  schoolBackground: string;
  gpa: string;
  languageScore: string;
  experiences: string;
  budget: string;
  scholarshipPreference: string;
  matchLevel: string;
  matchScore: string;
  leadQuality: string;
  reportStatus: string;
  followupStatus: string;
  risks: string;
  nextSteps: string;
  consultantNotes: string;
};

export type FullReportScholarship = {
  reportId: string;
  name: string;
  country: string;
  institution: string;
  degreeLevel: string;
  scholarshipType: string;
  amount: string;
  deadline: string;
  officialUrl: string;
  sourceType: string;
  sourceReliability: string;
  aiConfidence: number;
  matchReason: string;
  risks: string;
  requiresHumanReview: string;
  advisorDecision: string;
  advisorPriority: string;
  advisorNote: string;
};

export type FullReportData = {
  reportId: string;
  lead: FullReportLead;
  scholarships: FullReportScholarship[];
  stats: {
    scholarshipCount: number;
    highPriorityCount: number;
    humanReviewCount: number;
  };
};

function field(fields: FeishuFields, name: string) {
  const value = fields[name];
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) return value.join("\n");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function normalizeDecision(value: string) {
  const text = value.trim().toLowerCase();
  if (["remove", "移除", "不推荐", "删除", "no", "false"].includes(text)) return "remove";
  if (["keep", "保留", "推荐", "保留推荐", "yes", "true"].includes(text)) return "keep";
  return "unsure";
}

function normalizePriority(value: string) {
  const text = value.trim().toLowerCase();
  if (["high", "高", "高优先级", "重点", "重点推荐"].includes(text)) return "high";
  if (["low", "低", "低优先级", "备选"].includes(text)) return "low";
  return "medium";
}

function priorityRank(value: string) {
  const normalized = normalizePriority(value);
  if (normalized === "high") return 0;
  if (normalized === "medium") return 1;
  return 2;
}

function toNumber(value: string) {
  const cleaned = value.replace(/[^0-9.]/g, "");
  const parsed = Number(cleaned);
  if (!Number.isFinite(parsed)) return 0;
  if (parsed > 0 && parsed <= 1) return Math.round(parsed * 100);
  return Math.round(parsed);
}

function isHumanReviewRequired(value: string, advisorDecision: string) {
  const text = value.trim().toLowerCase();
  if (["否", "不需要", "false", "no"].includes(text)) return false;
  if (["是", "建议", "需要", "true", "yes"].includes(text)) return true;
  return advisorDecision === "unsure";
}

function mapLead(fields: FeishuFields): FullReportLead {
  return {
    reportId: field(fields, FEISHU_LEADS_FIELDS.reportId),
    createdAt: field(fields, FEISHU_LEADS_FIELDS.createdAt),
    wechat: field(fields, FEISHU_LEADS_FIELDS.wechat),
    email: field(fields, FEISHU_LEADS_FIELDS.email),
    currentEducation: field(fields, FEISHU_LEADS_FIELDS.currentEducation),
    targetDegree: field(fields, FEISHU_LEADS_FIELDS.targetDegree),
    targetCountry: field(fields, FEISHU_LEADS_FIELDS.targetCountry),
    targetMajor: field(fields, FEISHU_LEADS_FIELDS.targetMajor),
    intakeTime: field(fields, FEISHU_LEADS_FIELDS.intakeTime),
    schoolBackground: field(fields, FEISHU_LEADS_FIELDS.schoolBackground),
    gpa: field(fields, FEISHU_LEADS_FIELDS.gpa),
    languageScore: field(fields, FEISHU_LEADS_FIELDS.languageScore),
    experiences: field(fields, FEISHU_LEADS_FIELDS.experiences),
    budget: field(fields, FEISHU_LEADS_FIELDS.budget),
    scholarshipPreference: field(fields, FEISHU_LEADS_FIELDS.scholarshipPreference),
    matchLevel: field(fields, FEISHU_LEADS_FIELDS.matchLevel),
    matchScore: field(fields, FEISHU_LEADS_FIELDS.matchScore),
    leadQuality: field(fields, FEISHU_LEADS_FIELDS.leadQuality),
    reportStatus: field(fields, FEISHU_LEADS_FIELDS.reportStatus),
    followupStatus: field(fields, FEISHU_LEADS_FIELDS.followupStatus),
    risks: field(fields, FEISHU_LEADS_FIELDS.risks),
    nextSteps: field(fields, FEISHU_LEADS_FIELDS.nextSteps),
    consultantNotes: field(fields, FEISHU_LEADS_FIELDS.consultantNotes),
  };
}

function mapScholarship(fields: FeishuFields): FullReportScholarship {
  const advisorDecision = normalizeDecision(field(fields, FEISHU_SCHOLARSHIP_FIELDS.advisorDecision));
  const requiresHumanReview = isHumanReviewRequired(field(fields, FEISHU_SCHOLARSHIP_FIELDS.requiresHumanReview), advisorDecision);

  return {
    reportId: field(fields, FEISHU_SCHOLARSHIP_FIELDS.reportId),
    name: field(fields, FEISHU_SCHOLARSHIP_FIELDS.name),
    country: field(fields, FEISHU_SCHOLARSHIP_FIELDS.country),
    institution: field(fields, FEISHU_SCHOLARSHIP_FIELDS.institution),
    degreeLevel: field(fields, FEISHU_SCHOLARSHIP_FIELDS.degreeLevel),
    scholarshipType: field(fields, FEISHU_SCHOLARSHIP_FIELDS.scholarshipType),
    amount: field(fields, FEISHU_SCHOLARSHIP_FIELDS.amount),
    deadline: field(fields, FEISHU_SCHOLARSHIP_FIELDS.deadline),
    officialUrl: field(fields, FEISHU_SCHOLARSHIP_FIELDS.officialUrl),
    sourceType: field(fields, FEISHU_SCHOLARSHIP_FIELDS.sourceType) || "待确认",
    sourceReliability: field(fields, FEISHU_SCHOLARSHIP_FIELDS.sourceReliability) || "medium",
    aiConfidence: toNumber(field(fields, FEISHU_SCHOLARSHIP_FIELDS.aiConfidence)),
    matchReason: field(fields, FEISHU_SCHOLARSHIP_FIELDS.matchReason),
    risks: field(fields, FEISHU_SCHOLARSHIP_FIELDS.risks),
    requiresHumanReview: requiresHumanReview ? "是" : "否",
    advisorDecision,
    advisorPriority: normalizePriority(field(fields, FEISHU_SCHOLARSHIP_FIELDS.advisorPriority)),
    advisorNote: field(fields, FEISHU_SCHOLARSHIP_FIELDS.advisorNote),
  };
}

export async function getFullReportData(reportId: string): Promise<FullReportData | null> {
  const normalizedReportId = reportId.trim();
  if (!normalizedReportId) return null;

  const [leadRecords, scholarshipRecords] = await Promise.all([listBitableRecords("leads"), listBitableRecords("scholarships")]);

  const leadRecord = leadRecords.find((record) => field(record.fields, FEISHU_LEADS_FIELDS.reportId) === normalizedReportId);
  if (!leadRecord) return null;

  const lead = mapLead(leadRecord.fields);
  const allScholarships = scholarshipRecords
    .filter((record) => field(record.fields, FEISHU_SCHOLARSHIP_FIELDS.reportId) === normalizedReportId)
    .map((record) => mapScholarship(record.fields));

  const recommended = allScholarships.filter((item) => item.advisorDecision !== "remove");
  const scholarships = (recommended.length > 0 ? recommended : allScholarships).sort((a, b) => {
    const priorityDiff = priorityRank(a.advisorPriority) - priorityRank(b.advisorPriority);
    if (priorityDiff !== 0) return priorityDiff;
    return b.aiConfidence - a.aiConfidence;
  });

  return {
    reportId: normalizedReportId,
    lead,
    scholarships,
    stats: {
      scholarshipCount: scholarships.length,
      highPriorityCount: scholarships.filter((item) => item.advisorPriority === "high").length,
      humanReviewCount: scholarships.filter((item) => item.requiresHumanReview === "是" || item.advisorDecision === "unsure").length,
    },
  };
}
