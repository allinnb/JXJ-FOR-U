import { searchExa } from "@/src/lib/ai/exa";

const officialSignals = [".edu", ".ac.uk", ".edu.au", ".edu.sg", ".edu.hk", ".gov", ".gov.uk", ".gov.au", "scholarship", "foundation", "erasmus", "daad"];
const lowQualitySignals = ["forum", "reddit", "quora", "agent", "admission-service", "blogspot", "medium.com", "contentfarm"];

function scoreUrl(url: string) {
  const normalized = url.toLowerCase();
  let score = 0;
  officialSignals.forEach((signal) => {
    if (normalized.includes(signal)) score += 2;
  });
  lowQualitySignals.forEach((signal) => {
    if (normalized.includes(signal)) score -= 5;
  });
  return score;
}

export async function searchScholarshipWeb(queries: string[]) {
  const urls = new Map<string, number>();

  for (const query of queries.slice(0, 5)) {
    const results = await searchExa(query);
    results.slice(0, 5).forEach((result) => {
      if (!result.url) return;
      const score = scoreUrl(result.url);
      if (score < -1) return;
      urls.set(result.url, Math.max(urls.get(result.url) ?? -999, score));
    });
  }

  return Array.from(urls.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([url]) => url)
    .slice(0, 12);
}
