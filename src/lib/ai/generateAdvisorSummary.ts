import { callOpenRouterChat, getOpenRouterModels } from "@/src/lib/ai/openrouter";
import type { MatchResult, UserProfile } from "@/src/types";

export async function generateAdvisorSummary(userProfile: UserProfile, matchResult: MatchResult) {
  const models = getOpenRouterModels();
  return callOpenRouterChat<string>({
    model: models.strong,
    messages: [
      { role: "system", content: "You are a Chinese study abroad scholarship advisor. Write a concise internal advisor summary in Chinese." },
      { role: "user", content: JSON.stringify({ userProfile, matchResult }) },
    ],
  });
}
