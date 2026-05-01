import { callOpenRouterChat, getOpenRouterModels } from "@/src/lib/ai/openrouter";
import type { UserProfile } from "@/src/types";

function fallbackQueries(userProfile: UserProfile): string[] {
  const country = userProfile.targetCountry || "international";
  const degree = userProfile.targetDegree || "degree";
  const major = userProfile.targetMajor || "all subjects";
  return [
    `${country} ${degree} ${major} scholarships international students official deadline`,
    `${country} university scholarships international students ${degree} official`,
    `${country} government scholarship international students ${degree} deadline`,
  ];
}

export async function generateSearchQueries(userProfile: UserProfile): Promise<string[]> {
  const models = getOpenRouterModels();
  try {
    const result = await callOpenRouterChat<{ queries: string[] }>({
      model: models.fast,
      json: true,
      messages: [
        {
          role: "system",
          content: "Generate 3-5 concise English web search queries for official scholarship pages. Return JSON: {\"queries\":[...]} only.",
        },
        {
          role: "user",
          content: `Target country: ${userProfile.targetCountry}\nTarget degree: ${userProfile.targetDegree}\nMajor: ${userProfile.targetMajor}\nProfile: ${userProfile.schoolBackground}, GPA ${userProfile.gpa}, language ${userProfile.languageScore}\nEach query should include international students, scholarship, official, deadline when natural.`,
        },
      ],
    });

    const queries = (result.queries || []).filter(Boolean).slice(0, 5);
    return queries.length > 0 ? queries : fallbackQueries(userProfile);
  } catch (error) {
    console.error("[generateSearchQueries] OpenRouter failed, using fallback queries", error);
    return fallbackQueries(userProfile);
  }
}
