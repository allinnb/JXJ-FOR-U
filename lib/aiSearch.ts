import { matchScholarships } from "@/lib/matcher";
import type { AssessmentFormData, MatchResult } from "@/types";

export function searchScholarshipsWithAI(userProfile: AssessmentFormData): MatchResult {
  // TODO: 生成搜索关键词，例如目标国家、学历阶段、专业方向、奖学金类型和入学季。
  // TODO: 搜索大学官网、政府官网、基金会官网等高可信来源。
  // TODO: 抽取奖学金金额、资格条件、截止日期、申请材料和官网链接。
  // TODO: 验证来源可靠性，优先保留官方页面并标记信息更新时间。
  // TODO: 结合用户背景生成匹配评分、风险提示和申请优先级。
  return matchScholarships(userProfile);
}
