export type EducationLevel = "高中/国际高中" | "本科" | "硕士" | "博士" | "其他";
export type TargetDegree = "本科" | "硕士" | "博士" | "交换/访学";
export type SchoolBackground = "985" | "211" | "双非" | "海外院校" | "国际学校" | "其他";
export type ScholarshipPreference = "全奖" | "半奖" | "学费减免" | "生活补助" | "都可以";
export type YesNo = "是" | "否";

export type MatchLevel = "high" | "medium" | "low";
export type LeadQuality = "hot" | "warm" | "cold";
export type ReportStatus = "draft_mock" | "ai_pending" | "ai_generated" | "human_reviewing" | "human_verified" | "sent_to_user";
export type FollowupStatus = "new" | "reviewing" | "contacted" | "paid" | "closed";
export type SourceType = "university" | "government" | "foundation" | "international_org" | "third_party" | "unknown";
export type SourceReliability = "high" | "medium" | "low";
export type AdvisorDecision = "keep" | "remove" | "unsure";
export type AdvisorPriority = "high" | "medium" | "low";

export interface UserProfile {
  currentEducation: EducationLevel;
  targetDegree: TargetDegree;
  targetCountry: string;
  targetMajor: string;
  intakeTime: string;
  schoolBackground: SchoolBackground;
  gpa: string;
  languageScore: string;
  experiences: string;
  budget: string;
  scholarshipPreference: ScholarshipPreference;
  acceptsNonPopular: YesNo;
  needsConsulting: YesNo;
  wechat: string;
  email: string;
}

export type AssessmentFormData = UserProfile;

export interface ScholarshipEvidence {
  sourceTitle: string;
  sourceSnippet: string;
  sourceTextExcerpt: string;
  deadlineRawText: string;
  eligibilityRawText: string;
  lastFetchedAt: string;
}

export interface AdvisorReview {
  advisorDecision: AdvisorDecision;
  advisorPriority: AdvisorPriority;
  advisorNote: string;
}

export interface Scholarship {
  id: string;
  name: string;
  country: string;
  institution: string;
  degreeLevel: TargetDegree | TargetDegree[] | string;
  scholarshipType: ScholarshipPreference | "混合资助" | string;
  amount: string;
  deadline: string;
  officialUrl: string;
  sourceType: SourceType;
  sourceReliability: SourceReliability;
  aiConfidence: number;
  matchReason: string;
  risks: string;
  requiresHumanReview: boolean;
  lastVerifiedAt: string;
  evidence?: ScholarshipEvidence;
  advisorReview?: AdvisorReview;
}

export interface MatchResult {
  reportId: string;
  createdAt: string;
  matchLevel: MatchLevel;
  matchScore: number;
  leadQuality: LeadQuality;
  recommendedScholarships: Scholarship[];
  risks: string[];
  nextSteps: string[];
  reportStatus: ReportStatus;
  recommendedCountries: string[];
  recommendedFollowUp: string;
  recommendedServicePackage: string;
  disclaimer: string;
}

export interface LeadRecord {
  reportId: string;
  createdAt: string;
  userProfile: UserProfile;
  matchResult: MatchResult;
  followupStatus: FollowupStatus;
  reportStatus: ReportStatus;
  consultantNotes: string;
}

export interface AIRunRecord {
  runId: string;
  reportId: string;
  createdAt: string;
  runType: string;
  modelFast: string;
  modelStrong: string;
  exaSearchCount: number;
  processedUrlCount: number;
  success: boolean;
  errorMessage: string;
}

export interface FeishuSyncStatus {
  success: boolean;
  reportId?: string;
  error?: string;
  syncedAt?: string;
}

export const matchLevelLabels: Record<MatchLevel, string> = {
  high: "高",
  medium: "中",
  low: "低",
};

export const sourceTypeLabels: Record<SourceType, string> = {
  university: "大学官网",
  government: "政府官网",
  foundation: "基金会官网",
  international_org: "国际组织官网",
  third_party: "第三方来源",
  unknown: "待确认来源",
};

export const sourceReliabilityLabels: Record<SourceReliability, string> = {
  high: "高",
  medium: "中",
  low: "低",
};
