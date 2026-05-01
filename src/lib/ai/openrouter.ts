type OpenRouterMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export interface OpenRouterOptions {
  model?: string;
  messages: OpenRouterMessage[];
  json?: boolean;
  temperature?: number;
}

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`缺少服务端环境变量 ${name}`);
  return value;
}

export function getOpenRouterModels() {
  return {
    fast: process.env.OPENROUTER_MODEL_FAST || "openai/gpt-4o-mini",
    strong: process.env.OPENROUTER_MODEL_STRONG || "openai/gpt-4o",
  };
}

export async function callOpenRouterChat<T = string>({ model, messages, json = false, temperature = 0.2 }: OpenRouterOptions): Promise<T> {
  const apiKey = requireEnv("OPENROUTER_API_KEY");
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "X-Title": "AI Scholarship Matcher",
    },
    body: JSON.stringify({
      model: model || getOpenRouterModels().fast,
      messages,
      temperature,
      response_format: json ? { type: "json_object" } : undefined,
    }),
    cache: "no-store",
  });

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
    error?: { message?: string; code?: number; metadata?: { raw?: string; provider_name?: string } };
  };
  if (!response.ok || data.error) {
    const providerDetail = data.error?.metadata?.raw || data.error?.message;
    const providerName = data.error?.metadata?.provider_name;
    console.error("[openrouter] request failed", {
      status: response.status,
      model: model || getOpenRouterModels().fast,
      error: data.error,
    });
    throw new Error(providerDetail ? `OpenRouter 调用失败${providerName ? `（${providerName}）` : ""}: ${providerDetail}` : "OpenRouter 调用失败");
  }

  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("OpenRouter 未返回内容");

  if (!json) return content as T;

  try {
    return JSON.parse(content) as T;
  } catch {
    throw new Error("OpenRouter JSON 解析失败");
  }
}
