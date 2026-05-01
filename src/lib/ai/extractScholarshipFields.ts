import { callOpenRouterChat, getOpenRouterModels } from "@/src/lib/ai/openrouter";
import type { Scholarship, UserProfile } from "@/src/types";

export interface WebContentInput {
  url: string;
  title?: string;
  text: string;
}

export async function extractScholarshipFields(content: WebContentInput, userProfile: UserProfile): Promise<Partial<Scholarship> | null> {
  const models = getOpenRouterModels();
  const result = await callOpenRouterChat<{ scholarship: Partial<Scholarship> | null }>({
    model: models.fast,
    json: true,
    messages: [
      {
        role: "system",
        content:
          "Extract scholarship fields from official-like web content. Return JSON {scholarship:{...}} or {scholarship:null}. Do not invent amount or deadline; use 待确认 when unclear. If no officialUrl, aiConfidence cannot be high. third_party sourceReliability cannot be high. If deadline or eligibility unclear, requiresHumanReview=true.",
      },
      {
        role: "user",
        content: `User target: ${userProfile.targetCountry}, ${userProfile.targetDegree}, ${userProfile.targetMajor}\nURL: ${content.url}\nTitle: ${content.title || ""}\nText:\n${content.text.slice(0, 12000)}`,
      },
    ],
  });

  return result.scholarship || null;
}
