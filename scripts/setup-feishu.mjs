#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const FEISHU_BASE_URL = "https://open.feishu.cn";
const TEXT_FIELD_TYPE = 1;
const DEFAULT_BASE_NAME = "AI 奖学金匹配助手 - 顾问工作台";

const TABLE_SCHEMAS = [
  {
    key: "LEADS",
    name: "Leads",
    description: "客户资料、匹配结果、报告状态和顾问跟进状态。",
    fields: [
      "报告编号",
      "提交时间",
      "微信号",
      "邮箱",
      "当前学历",
      "目标学历",
      "目标国家",
      "目标专业",
      "入学时间",
      "学校背景",
      "GPA/均分",
      "语言成绩",
      "经历摘要",
      "家庭预算",
      "奖学金偏好",
      "是否接受非热门国家",
      "是否需要人工辅导",
      "匹配等级",
      "匹配分数",
      "线索等级",
      "报告状态",
      "跟进状态",
      "风险提示",
      "下一步建议",
      "顾问备注",
    ],
  },
  {
    key: "SCHOLARSHIPS",
    name: "Scholarships",
    description: "每份报告下的推荐奖学金、来源可信度、匹配理由和顾问复核字段。",
    fields: [
      "报告编号",
      "奖学金名称",
      "国家",
      "学校/机构",
      "适合学历",
      "奖学金类型",
      "金额",
      "截止日期",
      "官网链接",
      "来源类型",
      "来源可靠性",
      "AI置信度",
      "匹配理由",
      "风险提示",
      "是否建议人工复核",
      "顾问判断",
      "顾问优先级",
      "顾问备注",
    ],
  },
  {
    key: "AI_RUNS",
    name: "AI Runs",
    description: "顾问手动 AI 复核运行记录、模型、Exa 查询次数和错误信息。",
    fields: [
      "运行编号",
      "报告编号",
      "运行时间",
      "运行类型",
      "快速模型",
      "强模型",
      "Exa查询次数",
      "处理URL数",
      "是否成功",
      "错误信息",
    ],
  },
];

function loadDotEnvFile(filePath) {
  if (!existsSync(filePath)) return;

  const content = readFileSync(filePath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const equalIndex = line.indexOf("=");
    if (equalIndex === -1) continue;

    const key = line.slice(0, equalIndex).trim();
    let value = line.slice(equalIndex + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function loadLocalEnv() {
  const cwd = process.cwd();
  loadDotEnvFile(path.join(cwd, ".env.local"));
  loadDotEnvFile(path.join(cwd, ".env"));
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`缺少环境变量 ${name}。请先写入 .env.local，或在命令行环境中设置。`);
  }
  return value;
}

function normalizeToken(value) {
  return value.split("?")[0].trim();
}

async function getTenantAccessToken() {
  const response = await fetch(`${FEISHU_BASE_URL}/open-apis/auth/v3/tenant_access_token/internal`, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      app_id: requireEnv("FEISHU_APP_ID"),
      app_secret: requireEnv("FEISHU_APP_SECRET"),
    }),
  });

  const data = await response.json();
  if (!response.ok || data.code !== 0 || !data.tenant_access_token) {
    throw new Error(`获取 tenant_access_token 失败：${data.msg || response.statusText}`);
  }

  return data.tenant_access_token;
}

async function feishuFetch(pathname, token, init = {}) {
  const response = await fetch(`${FEISHU_BASE_URL}${pathname}`, {
    ...init,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${token}`,
      ...(init.headers || {}),
    },
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = { msg: response.statusText };
  }

  if (!response.ok || data.code !== 0) {
    const message = data.msg || data.error?.message || response.statusText;
    throw new Error(`${message} (${pathname})`);
  }

  return data;
}

function extractAppToken(data) {
  return (
    data?.data?.app?.app_token ||
    data?.data?.app?.token ||
    data?.data?.app_token ||
    data?.data?.token ||
    data?.app?.app_token ||
    data?.app_token ||
    ""
  );
}

async function createBase(token) {
  const baseName = process.env.FEISHU_SETUP_BASE_NAME || DEFAULT_BASE_NAME;
  const folderToken = process.env.FEISHU_FOLDER_TOKEN ? normalizeToken(process.env.FEISHU_FOLDER_TOKEN) : "";

  const payload = folderToken
    ? { name: baseName, folder_token: folderToken }
    : { name: baseName };

  const data = await feishuFetch("/open-apis/bitable/v1/apps", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const appToken = extractAppToken(data);
  if (!appToken) {
    throw new Error(`创建多维表格 Base 成功但未找到 app_token，原始返回：${JSON.stringify(data)}`);
  }

  return { appToken, baseName };
}

async function createTable(appToken, token, tableSchema) {
  const firstFieldName = tableSchema.fields[0];
  const payload = {
    table: {
      name: tableSchema.name,
      default_view_name: "默认视图",
      fields: [{ field_name: firstFieldName, type: TEXT_FIELD_TYPE }],
    },
  };

  const data = await feishuFetch(`/open-apis/bitable/v1/apps/${appToken}/tables`, token, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const tableId = data?.data?.table_id || data?.data?.table?.table_id;
  if (!tableId) {
    throw new Error(`创建 ${tableSchema.name} 表成功但未返回 table_id，原始返回：${JSON.stringify(data)}`);
  }

  return tableId;
}

async function createField(appToken, tableId, token, fieldName) {
  return feishuFetch(`/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/fields`, token, {
    method: "POST",
    body: JSON.stringify({
      field_name: fieldName,
      type: TEXT_FIELD_TYPE,
    }),
  });
}

async function createTablesAndFields(appToken, token) {
  const results = [];

  for (const tableSchema of TABLE_SCHEMAS) {
    console.log(`创建数据表：${tableSchema.name} - ${tableSchema.description}`);
    const tableId = await createTable(appToken, token, tableSchema);
    console.log(`  已创建 ${tableSchema.name}，table_id=${tableId}`);

    const remainingFields = tableSchema.fields.slice(1);
    for (const fieldName of remainingFields) {
      process.stdout.write(`  创建字段：${fieldName} ... `);
      await createField(appToken, tableId, token, fieldName);
      process.stdout.write("完成\n");
    }

    results.push({ ...tableSchema, tableId });
    console.log("");
  }

  return results;
}

function printResults(appToken, results, createdBaseName) {
  const leads = results.find((item) => item.key === "LEADS");
  const scholarships = results.find((item) => item.key === "SCHOLARSHIPS");
  const aiRuns = results.find((item) => item.key === "AI_RUNS");

  console.log("创建完成。请把下面配置复制到 .env.local 和 Vercel Environment Variables：\n");
  if (createdBaseName) {
    console.log(`# 自动创建的 Base：${createdBaseName}`);
  }
  console.log(`FEISHU_BITABLE_APP_TOKEN=${appToken}`);
  console.log(`FEISHU_LEADS_TABLE_ID=${leads.tableId}`);
  console.log(`FEISHU_SCHOLARSHIPS_TABLE_ID=${scholarships.tableId}`);
  console.log(`FEISHU_AI_RUNS_TABLE_ID=${aiRuns.tableId}`);
  console.log("\n下一步：重启 npm run dev，然后提交一次测评，检查 Leads 和 Scholarships 是否出现记录。\n");
}

async function setupFeishu() {
  loadLocalEnv();

  const token = await getTenantAccessToken();
  const setupMode = process.env.FEISHU_SETUP_MODE || "auto";
  let appToken = process.env.FEISHU_BITABLE_APP_TOKEN ? normalizeToken(process.env.FEISHU_BITABLE_APP_TOKEN) : "";
  let createdBaseName = "";

  console.log("\n开始飞书多维表格初始化...");
  console.log("说明：脚本会创建 Leads、Scholarships、AI Runs 三张表，字段第一版全部使用文本类型。\n");

  if (setupMode === "create-base" || !appToken) {
    console.log("未指定可用 FEISHU_BITABLE_APP_TOKEN，或已设置 FEISHU_SETUP_MODE=create-base。正在自动创建新的多维表格 Base...");
    const created = await createBase(token);
    appToken = created.appToken;
    createdBaseName = created.baseName;
    console.log(`已创建 Base：${createdBaseName}，app_token=${appToken}\n`);
  } else {
    console.log(`将优先使用现有 Base：${appToken}`);
    console.log("如果这里仍然 Forbidden，请在 .env.local 中设置 FEISHU_SETUP_MODE=create-base，让脚本自动创建新 Base。\n");
  }

  const results = await createTablesAndFields(appToken, token);
  printResults(appToken, results, createdBaseName);
}

setupFeishu().catch((error) => {
  console.error("\n飞书 setup 失败：");
  console.error(error instanceof Error ? error.message : error);
  console.error("\n排查建议：");
  console.error("1. 若现有 Base 无法授权给企业自建应用，请在 .env.local 增加 FEISHU_SETUP_MODE=create-base，改为自动创建新 Base。");
  console.error("2. 确认开放平台应用已开通并发布多维表格 app/table/field/record 读写权限。");
  console.error("3. 如果自动创建 Base 也失败，通常是应用缺少创建云文档/多维表格权限，或应用未发布新版本。\n");
  process.exit(1);
});
