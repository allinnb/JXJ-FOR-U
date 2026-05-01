import { callOpenRouterChat, getOpenRouterModels } from "@/src/lib/ai/openrouter";
import type { Scholarship, UserProfile } from "@/src/types";

export async function scoreScholarshipMatch(userProfile: UserProfile, scholarship: Partial<Scholarship>) {
  const models = getOpenRouterModels();
  return callOpenRouterChat<{ score: number; matchReason: string; risks: string; requiresHumanReview: boolean }>({
    model: models.strong,
    json: true,
    messages: [
      { role: "system", content: "Score how well a scholarship matches a Chinese international student profile. Return JSON only." },
      { role: "user", content: JSON.stringify({ userProfile, scholarship }) },
    ],
  });
}
