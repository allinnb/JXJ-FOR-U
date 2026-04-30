export type EducationLevel = "高中/国际高中" | "本科" | "硕士" | "博士" | "其他";

export type TargetDegree = "本科" | "硕士" | "博士" | "交换/访学";

export type SchoolBackground = "985" | "211" | "双非" | "海外院校" | "国际学校" | "其他";

export type ScholarshipPreference = "全奖" | "半奖" | "学费减免" | "生活补助" | "都可以";

export type MatchLevel = "高" | "中" | "低";

export type LeadQuality = "hot" | "warm" | "cold";

export interface AssessmentFormData {
  currentEducation: EducationLevel;
  targetDegree: TargetDegree;
  targetCountries: string;
  majorDirection: string;
  intakeTime: string;
  schoolBackground: SchoolBackground;
  gpa: string;
  languageScore: string;
  experiences: string;
  familyBudget: string;
  scholarshipPreference: ScholarshipPreference;
  acceptNonPopular: "是" | "否";
  needConsulting: "是" | "否";
  wechat: string;
  email: string;
}

export interface Scholarship {
  id: string;
  name: string;
  country: string;
  degreeLevels: TargetDegree[];
  type: ScholarshipPreference | "混合资助";
  difficulty: "较低" | "中等" | "较高";
  suitableMajors: string[];
  matchReason: string;
  risk: string;
  officialUrl: string;
  sourceType: "大学官网" | "政府官网" | "基金会官网" | "项目官网" | "待人工核验";
  sourceReliability: "高" | "中" | "待核验";
  lastVerifiedAt: string;
  deadlineStatus: "开放中" | "即将截止" | "待公布" | "需官网确认";
  aiConfidence: number;
  needsHumanReview: boolean;
}

export interface MatchResult {
  overallMatchScore: number;
  matchLevel: MatchLevel;
  recommendedCountries: string[];
  recommendedScholarships: Scholarship[];
  risks: string[];
  nextSteps: string[];
  leadQuality: LeadQuality;
  recommendedFollowUp: string;
  recommendedServicePackage: string;
}

export interface ReportMeta {
  reportId: string;
  generatedAt: string;
}
