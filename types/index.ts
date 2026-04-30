export type EducationLevel = "高中/国际高中" | "本科" | "硕士" | "博士" | "其他";

export type TargetDegree = "本科" | "硕士" | "博士" | "交换/访学";

export type SchoolBackground = "985" | "211" | "双非" | "海外院校" | "国际学校" | "其他";

export type ScholarshipPreference = "全奖" | "半奖" | "学费减免" | "生活补助" | "都可以";

export type MatchLevel = "高" | "中" | "低";

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
}

export interface MatchResult {
  overallMatchScore: number;
  matchLevel: MatchLevel;
  recommendedCountries: string[];
  recommendedScholarships: Scholarship[];
  risks: string[];
  nextSteps: string[];
}
