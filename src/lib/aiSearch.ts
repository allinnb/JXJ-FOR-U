import { matchScholarships } from "@/src/lib/matcher";
import type { MatchResult, UserProfile } from "@/src/types";

export function searchScholarshipsWithAI(userProfile: UserProfile): MatchResult {
  // TODO: 生成搜索关键词。
  // TODO: 搜索大学官网、政府官网、基金会官网等高可信来源。
  // TODO: 抽取奖学金金额、资格、截止日期、材料清单和官网链接。
  // TODO: 验证来源可靠性，保留 evidence chain。
  // TODO: 生成匹配评分，并进入顾问手动复核流程。
  // 当前内部试用版不在用户提交时自动运行 AI 搜索，先返回规则 mock 初筛。
  return matchScholarships(userProfile);
}
