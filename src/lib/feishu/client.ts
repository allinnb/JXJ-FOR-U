const FEISHU_BASE_URL = "https://open.feishu.cn";

type TokenCache = {
  token: string;
  expiresAt: number;
};

let tokenCache: TokenCache | null = null;

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`缺少服务端环境变量 ${name}`);
  }
  return value;
}

export type FeishuTableName = "leads" | "scholarships" | "aiRuns";

export function getFeishuBitableConfig(table: FeishuTableName) {
  const appToken = requireEnv("FEISHU_BITABLE_APP_TOKEN");
  const tableIdMap = {
    leads: requireEnv("FEISHU_LEADS_TABLE_ID"),
    scholarships: requireEnv("FEISHU_SCHOLARSHIPS_TABLE_ID"),
    aiRuns: requireEnv("FEISHU_AI_RUNS_TABLE_ID"),
  };

  return { appToken, tableId: tableIdMap[table] };
}

export async function getFeishuTenantAccessToken() {
  const now = Date.now();
  if (tokenCache && tokenCache.expiresAt > now + 60_000) {
    return tokenCache.token;
  }

  try {
    const response = await fetch(`${FEISHU_BASE_URL}/open-apis/auth/v3/tenant_access_token/internal`, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        app_id: requireEnv("FEISHU_APP_ID"),
        app_secret: requireEnv("FEISHU_APP_SECRET"),
      }),
      cache: "no-store",
    });

    const data = (await response.json()) as { code?: number; msg?: string; tenant_access_token?: string; expire?: number };
    if (!response.ok || data.code !== 0 || !data.tenant_access_token) {
      throw new Error(data.msg || "获取 tenant_access_token 失败");
    }

    tokenCache = {
      token: data.tenant_access_token,
      expiresAt: now + Math.max(60, data.expire || 3600) * 1000,
    };

    return tokenCache.token;
  } catch (error) {
    console.error("[feishu] get token failed", error);
    throw new Error(error instanceof Error ? error.message : "飞书 token 获取失败");
  }
}

export async function feishuFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  try {
    const token = await getFeishuTenantAccessToken();
    const response = await fetch(`${FEISHU_BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${token}`,
        ...(init.headers || {}),
      },
      cache: "no-store",
    });

    const data = (await response.json()) as { code?: number; msg?: string } & T;
    if (!response.ok || data.code !== 0) {
      throw new Error(data.msg || `飞书 API 请求失败：${path}`);
    }

    return data;
  } catch (error) {
    console.error("[feishu] api failed", { path, error });
    throw new Error(error instanceof Error ? error.message : "飞书 API 请求失败");
  }
}

function toFeishuTextValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "boolean") return value ? "是" : "否";
  if (Array.isArray(value)) return value.map((item) => toFeishuTextValue(item)).filter(Boolean).join("\n");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function normalizeTextFields(fields: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, toFeishuTextValue(value)]));
}

export async function createBitableRecord(table: FeishuTableName, fields: Record<string, unknown>) {
  const { appToken, tableId } = getFeishuBitableConfig(table);
  return feishuFetch(`/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records`, {
    method: "POST",
    body: JSON.stringify({ fields: normalizeTextFields(fields) }),
  });
}

type BitableRecord = {
  record_id: string;
  fields: Record<string, unknown>;
};

type ListRecordsResponse = {
  data?: {
    items?: BitableRecord[];
    has_more?: boolean;
    page_token?: string;
  };
};

export async function listBitableRecords(table: FeishuTableName, maxPages = 5) {
  const { appToken, tableId } = getFeishuBitableConfig(table);
  const records: BitableRecord[] = [];
  let pageToken = "";
  let page = 0;

  do {
    const params = new URLSearchParams({ page_size: "100" });
    if (pageToken) params.set("page_token", pageToken);

    const data = await feishuFetch<ListRecordsResponse>(
      `/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records?${params.toString()}`,
      { method: "GET" },
    );

    records.push(...(data.data?.items || []));
    pageToken = data.data?.has_more ? data.data.page_token || "" : "";
    page += 1;
  } while (pageToken && page < maxPages);

  return records;
}
