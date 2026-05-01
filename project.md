# AI Scholarship Matcher / AI 留学奖学金匹配助手

## 项目定位
用 vibe coding 的方式快速搭建并迭代一个可运行的 H5 MVP，帮助准备出国留学的中国学生根据个人背景生成奖学金匹配报告。当前阶段升级为“内部顾问小范围试用版”：用户端保持 H5 测评体验，顾问端使用飞书多维表格作为轻量工作台。

## 目标用户
- 准备申请海外本科、硕士、博士、交换项目的中国学生
- 预算有限、希望提高奖学金机会的家庭
- 需要人工复核、申请策略和材料辅导的潜在咨询客户
- 内部留学顾问，用飞书查看客户、复核结果、修改状态和备注

## 当前阶段原则
- ✅ 用户端保持 H5 测评体验
- ✅ 用户提交后立即看到本地规则初筛简版报告
- ✅ 用户资料、报告结果、推荐奖学金可同步到飞书多维表格
- ✅ 顾问微信统一为 `heyiao2012`
- ✅ AI 动态搜索不在用户提交时自动运行，只预留顾问手动触发后端接口
- ⬜ 不做 Supabase
- ⬜ 不做复杂后台
- ⬜ 不做微信登录
- ⬜ 不做支付
- ⬜ 不做完整 CRM

## MVP 范围
### 包含
- ✅ Next.js + TypeScript + Tailwind CSS + App Router
- ✅ 手机端优先 H5 页面
- ✅ 首页
- ✅ 测评表单页
- ✅ 结果报告页
- ✅ 咨询转化区块
- ✅ 本地 mock 奖学金数据
- ✅ 可替换的 matcher 规则层
- ✅ `src/lib/config.ts` 统一配置
- ✅ `src/types/index.ts` 统一类型定义
- ✅ `src/lib/matcher.ts` 规范化规则 matcher
- ✅ `src/lib/consultationText.ts` 咨询复制话术
- ✅ 飞书多维表格接入封装：`src/lib/feishu/*`
- ✅ `POST /api/leads`：同步 Leads 和 Scholarships 表
- ✅ OpenRouter + Exa 服务端封装：`src/lib/ai/*`
- ✅ `POST /api/admin/run-ai-review`：顾问手动 AI 复核接口骨架
- ✅ `.env.example`
- ✅ 飞书配置文档、内部顾问流程文档、AI 搜索架构文档
- ✅ 本地运行验证（`npm run lint`、`npm run build`、`npm run dev`）

### 不包含
- ⬜ 登录系统
- ⬜ 支付系统
- ⬜ 复杂后台管理系统
- ⬜ Supabase
- ⬜ 微信登录
- ⬜ 用户提交时自动运行实时 AI 搜索

## 页面结构
1. 首页 `/`
   - 强转化标题：测一测你的背景，适合申请哪些海外奖学金？
   - 副标题：输入 GPA、目标国家、专业和预算，AI 为你初筛可申请的奖学金方向，并由顾问提供官网核验与申请策略建议。
   - 主 CTA：开始免费测评
   - 次级 CTA：查看样例报告
   - 样例报告预览：高匹配机会、中匹配机会、主要风险、建议方向
   - 流程展示：填写背景 → 生成初筛报告 → 顾问复核 → 申请策略建议
   - 展示顾问微信：`heyiao2012`，提供复制按钮
   - 信任说明：AI 初筛仅供参考，正式申请前以官网和人工复核为准

2. 测评表单页 `/assessment`
   - 3 步测评结构：申请目标、背景实力、预算与服务需求
   - 字段采用 `UserProfile`：当前学历、目标学历、目标国家、目标专业、入学时间、学校背景、GPA、语言、经历、预算、奖学金偏好、是否接受非热门、是否需要人工辅导、微信号、邮箱
   - 微信号选填：填写微信后，顾问可根据报告提供人工复核建议；不填写也可以查看简版报告
   - 必填校验、邮箱格式校验
   - 提交后本地调用 matcher 生成 `MatchResult`
   - 保存 `scholarshipUserProfile`、`scholarshipMatchResult`、`scholarshipFeishuSyncStatus` 到 localStorage
   - 旁路调用 `POST /api/leads` 同步飞书；失败不阻塞用户查看报告
   - 提交后展示 3–5 秒分析状态，再跳转 `/result`

3. 结果报告页 `/result`
   - 客户端读取 localStorage 中的 `UserProfile` 和 `MatchResult`
   - 无本地信息时引导回测评页
   - 飞书同步失败时展示温和提示：报告已生成，但后台同步失败，可添加顾问微信 `heyiao2012`
   - 显示 reportId、createdAt、matchLevel、matchScore、机会数量、用户背景摘要
   - 免费展示前 3 个奖学金机会
   - 每个推荐展示名称、国家、学校/机构、适合学历、类型、金额、截止日期、来源类型、来源可靠性、AI 置信度、匹配理由、风险、是否建议人工复核、官网链接
   - 展示完整报告诱饵：10–20 个机会、官网链接、截止日期、资格要求、材料清单、申请优先级和顾问建议
   - 服务卡片：免费简版报告 ¥0、完整 AI 奖学金报告 ¥99、人工复核 + 申请策略 ¥699
   - 按钮：复制顾问微信、复制咨询信息、获取完整报告、预约人工复核

## 代码结构
- `app/page.tsx`
- `app/assessment/page.tsx`
- `app/result/page.tsx`
- `app/api/leads/route.ts`
- `app/api/admin/run-ai-review/route.ts`
- `components/ResultClient.tsx`
- `components/CopyConsultationButton.tsx`
- `components/ServiceActionButton.tsx`
- `components/AddWechatLink.tsx`
- `src/lib/config.ts`
- `src/lib/matcher.ts`
- `src/lib/mockScholarships.ts`
- `src/lib/consultationText.ts`
- `src/lib/analytics.ts`
- `src/lib/feishu/client.ts`
- `src/lib/feishu/fieldMap.ts`
- `src/lib/feishu/leads.ts`
- `src/lib/feishu/scholarships.ts`
- `src/lib/feishu/aiRuns.ts`
- `src/lib/ai/openrouter.ts`
- `src/lib/ai/generateSearchQueries.ts`
- `src/lib/ai/extractScholarshipFields.ts`
- `src/lib/ai/scoreScholarshipMatch.ts`
- `src/lib/ai/generateAdvisorSummary.ts`
- `src/lib/ai/exa.ts`
- `src/lib/ai/searchScholarshipWeb.ts`
- `src/types/index.ts`
- `docs/FEISHU_SETUP.md`
- `docs/INTERNAL_ADVISOR_WORKFLOW.md`
- `docs/AI_SEARCH_ARCHITECTURE.md`

## 飞书多维表格设计
- Leads 表：客户资料、匹配结果、线索等级、报告状态、跟进状态、风险、下一步建议、顾问备注
- Scholarships 表：每个报告的推荐奖学金、来源、置信度、风险、顾问判断、顾问优先级、顾问备注
- AI Runs 表：顾问手动 AI 复核运行记录、模型、Exa 查询次数、处理 URL 数、成功/失败和错误信息

## AI 搜索接口预留
- 用户提交时不自动运行 AI 搜索
- 顾问可未来通过 `POST /api/admin/run-ai-review` 手动触发
- OpenRouter 负责：生成搜索 query、结构化抽取、匹配评分、顾问摘要
- Exa 负责：搜索候选网页、获取网页正文
- 成本控制：最多 5 条 query、每条 5 个结果、最多 12 个 URL、最多返回 8 个候选奖学金

## 商业转化设计
结果页底部服务卡片：
1. 免费简版报告：¥0，方向判断、前 3 个机会、关键风险；按钮“查看当前简版”
2. 完整 AI 奖学金报告：¥99，10–20 个机会、截止日期、官网链接、材料清单、优先级排序；按钮“获取完整报告”
3. 人工复核 + 申请策略：¥699，官网人工核验、申请组合策略、材料与时间线建议；按钮“预约人工复核”

第一版不处理付款；按钮点击后弹窗提示“请添加顾问微信 heyiao2012 获取完整服务。”

## 当前里程碑
- ✅ 项目需求整理
- ✅ MVP 任务拆解
- ✅ Next.js 项目初始化
- ✅ 首页开发
- ✅ 测评表单页开发
- ✅ 结果报告页开发
- ✅ Mock 数据与匹配逻辑开发
- ✅ AI 动态搜索接口结构预留
- ✅ 可信留学咨询风格 UI 优化
- ✅ Lead capture 与复制咨询信息功能
- ✅ 第二轮产品增强
- ✅ 转化率优化
- ✅ 内部顾问小范围试用版架构升级
- ✅ 飞书多维表格接入封装
- ✅ OpenRouter + Exa 手动 AI 复核接口骨架
- ✅ 文档补充
- ✅ 本地运行验证（`npm run lint`、`npm run build`、`npm run dev`）

## 后续建议
- ⬜ 在飞书中创建三张表并配置字段
- ⬜ 在 Vercel 配置 Feishu / OpenRouter / Exa 环境变量
- ⬜ 使用真实飞书环境测试 `POST /api/leads` 写入
- ⬜ 为 `/api/admin/run-ai-review` 增加顾问鉴权或简单管理密钥，避免公开触发
- ⬜ 后续如果规模扩大，再迁移到 Supabase 或正式后台
