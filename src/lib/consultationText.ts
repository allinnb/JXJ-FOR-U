import { CONSULTANT_WECHAT } from "@/src/lib/config";
import { matchLevelLabels } from "@/src/types";
import type { MatchResult, UserProfile } from "@/src/types";

export function generateConsultationText(userProfile: UserProfile, matchResult: MatchResult) {
  return [
    "你好，我刚刚完成了 AI 留学奖学金匹配测评。",
    `我的报告编号是：${matchResult.reportId}`,
    "我的背景是：",
    `- 当前学历：${userProfile.currentEducation}`,
    `- 目标学历：${userProfile.targetDegree}`,
    `- 目标国家：${userProfile.targetCountry}`,
    `- 专业方向：${userProfile.targetMajor}`,
    `- GPA/均分：${userProfile.gpa}`,
    `- 语言成绩：${userProfile.languageScore}`,
    `- 家庭预算：${userProfile.budget}`,
    `- 奖学金偏好：${userProfile.scholarshipPreference}`,
    `- 系统匹配等级：${matchLevelLabels[matchResult.matchLevel]}`,
    `- 匹配分数：${matchResult.matchScore}/100`,
    "",
    "我想进一步了解：",
    "1. 哪些奖学金最值得申请",
    "2. 是否需要完整报告",
    "3. 是否适合人工复核和申请策略咨询",
    "",
    `请帮我看一下。顾问微信：${CONSULTANT_WECHAT}`,
  ].join("\n");
}

export function generateAdvisorInternalText(userProfile: UserProfile, matchResult: MatchResult) {
  return [
    generateConsultationText(userProfile, matchResult),
    "",
    "以下为顾问内部跟进参考：",
    `线索等级：${matchResult.leadQuality}`,
    `推荐跟进方式：${matchResult.recommendedFollowUp}`,
    `适合推荐的服务套餐：${matchResult.recommendedServicePackage}`,
  ].join("\n");
}
