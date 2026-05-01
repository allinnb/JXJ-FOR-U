export interface ExaSearchResult {
  title?: string;
  url: string;
  text?: string;
  snippet?: string;
}

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`缺少服务端环境变量 ${name}`);
  return value;
}

async function exaFetch<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(`https://api.exa.ai${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": requireEnv("EXA_API_KEY"),
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(typeof data?.error === "string" ? data.error : "Exa API 调用失败");
  }

  return data as T;
}

export async function searchExa(query: string) {
  const data = await exaFetch<{ results?: ExaSearchResult[] }>("/search", {
    query,
    numResults: 5,
    type: "neural",
  });

  return data.results || [];
}

export async function getExaContents(urls: string[]) {
  if (urls.length === 0) return [];
  const data = await exaFetch<{ results?: ExaSearchResult[] }>("/contents", {
    urls,
    text: true,
  });

  return data.results || [];
}
