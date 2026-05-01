# 飞书多维表格配置指南

## 1. 创建飞书开放平台应用
1. 进入飞书开放平台。
2. 创建企业自建应用。
3. 在应用凭证中获取 `FEISHU_APP_ID` 和 `FEISHU_APP_SECRET`。
4. 确保应用具备多维表格读写权限，并发布/启用应用。

## 2. 创建多维表格
1. 在飞书中新建一个多维表格。
2. 建议命名为：AI 留学奖学金匹配助手 - 顾问工作台。
3. 把企业自建应用添加为该多维表格的可编辑协作者。
4. 从多维表格 URL 中复制 `base/` 后面的 token，填入 `.env.local` 的 `FEISHU_BITABLE_APP_TOKEN`。

## 2.1 自动初始化飞书工作台（推荐）
脚本支持两种模式：

### 模式 A：在已有 Base 下创建三张表
如果你已经有一个空的多维表格 Base，并且企业自建应用对该 Base 有操作权限，可以让脚本自动创建 `Leads`、`Scholarships`、`AI Runs` 三张表和全部字段。

先在 `.env.local` 配置：

```bash
FEISHU_APP_ID=你的企业自建应用 App ID
FEISHU_APP_SECRET=你的企业自建应用 App Secret
FEISHU_BITABLE_APP_TOKEN=多维表格 base token
```

然后运行：

```bash
npm run setup:feishu
```

### 模式 B：自动创建新的 Base，再创建三张表
如果企业自建应用无法被添加为现有 Base 的可编辑协作者，可以让脚本直接创建一个新的多维表格 Base。此时只需要配置应用凭证，并开启 `create-base` 模式：

```bash
FEISHU_APP_ID=你的企业自建应用 App ID
FEISHU_APP_SECRET=你的企业自建应用 App Secret
FEISHU_SETUP_MODE=create-base
FEISHU_SETUP_BASE_NAME=AI 奖学金匹配助手 - 顾问工作台
```

然后运行：

```bash
npm run setup:feishu
```

脚本会：
1. 获取 `tenant_access_token`。
2. 如果设置了 `FEISHU_SETUP_MODE=create-base`，则自动创建一个新的多维表格 Base。
3. 创建 `Leads`、`Scholarships`、`AI Runs` 三张新表。
4. 为每张表创建所需字段。
5. 输出：

```bash
FEISHU_BITABLE_APP_TOKEN=xxx
FEISHU_LEADS_TABLE_ID=xxx
FEISHU_SCHOLARSHIPS_TABLE_ID=xxx
FEISHU_AI_RUNS_TABLE_ID=xxx
```

请把输出的四行继续复制到 `.env.local` 和 Vercel Environment Variables。

注意：脚本第一版会把所有字段创建为文本字段，最适合 MVP 阶段稳定写入。不要在同一个 Base 中重复运行，否则会创建重复表。

## 2.2 手动创建三张表和字段
如果不使用脚本，也可以手动创建三张表：Leads、Scholarships、AI Runs，并按下面字段清单创建字段。

## 3. Leads 表字段
建议全部先用文本字段，后续再改成单选、数字、日期：
- 报告编号
- 提交时间
- 微信号
- 邮箱
- 当前学历
- 目标学历
- 目标国家
- 目标专业
- 入学时间
- 学校背景
- GPA/均分
- 语言成绩
- 经历摘要
- 家庭预算
- 奖学金偏好
- 是否接受非热门国家
- 是否需要人工辅导
- 匹配等级
- 匹配分数
- 线索等级
- 报告状态
- 跟进状态
- 风险提示
- 下一步建议
- 顾问备注

## 4. Scholarships 表字段
- 报告编号
- 奖学金名称
- 国家
- 学校/机构
- 适合学历
- 奖学金类型
- 金额
- 截止日期
- 官网链接
- 来源类型
- 来源可靠性
- AI置信度
- 匹配理由
- 风险提示
- 是否建议人工复核
- 顾问判断
- 顾问优先级
- 顾问备注

## 5. AI Runs 表字段
- 运行编号
- 报告编号
- 运行时间
- 运行类型
- 快速模型
- 强模型
- Exa查询次数
- 处理URL数
- 是否成功
- 错误信息

## 6. 获取 app_token 和 table_id
- `FEISHU_BITABLE_APP_TOKEN`：多维表格 URL 中 `base/` 后面的 app token。
- `FEISHU_LEADS_TABLE_ID`、`FEISHU_SCHOLARSHIPS_TABLE_ID`、`FEISHU_AI_RUNS_TABLE_ID`：每张表对应的 table id。

如果使用 `npm run setup:feishu`，脚本会自动输出三张表的 table_id；如果手动建表，也可以从 URL 或飞书 API 调试工具中获取。

## 7. 配置环境变量
复制 `.env.example` 为 `.env.local`，填写：

```bash
FEISHU_APP_ID=
FEISHU_APP_SECRET=
FEISHU_BITABLE_APP_TOKEN=
FEISHU_LEADS_TABLE_ID=
FEISHU_SCHOLARSHIPS_TABLE_ID=
FEISHU_AI_RUNS_TABLE_ID=
```

注意：`FEISHU_APP_SECRET` 只能服务端使用，不要写到前端代码或 `NEXT_PUBLIC_` 变量中。

## 8. 测试 POST /api/leads
本地启动：

```bash
npm run dev
```

提交测评表单后，前端会调用：

```txt
POST /api/leads
```

如果飞书配置正确，Leads 表会新增 1 条记录，Scholarships 表会新增 3 条奖学金记录。

## 9. 常见错误

### 字段名不匹配
飞书字段名必须和 `src/lib/feishu/fieldMap.ts` 一致。若你在飞书中改字段名，也要同步修改 fieldMap。

### 权限不足
确认开放平台应用已经申请并启用多维表格读写权限，且应用对该多维表格有访问权限。

如果企业自建应用无法被添加为已有 Base 的协作者，可以改用自动创建 Base 模式：

```bash
FEISHU_SETUP_MODE=create-base
npm run setup:feishu
```

如果自动创建 Base 仍然失败，通常说明应用缺少创建云文档/多维表格的权限，或权限修改后没有发布新版本。

### token 获取失败
检查 `FEISHU_APP_ID` 和 `FEISHU_APP_SECRET` 是否正确，应用是否已启用。

### table_id 错误
检查三个 table id 是否分别对应 Leads、Scholarships、AI Runs。

### 环境变量缺失
后端会返回 `缺少服务端环境变量 XXX`。这不会影响用户看到本地简版报告，但不会写入飞书。
