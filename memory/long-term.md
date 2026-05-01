# 长期记忆

（项目初始化中，尚无记忆。）

## 2026-04-30
- 项目名称：AI Scholarship Matcher / AI 留学奖学金匹配助手。
- 用户目标：快速用 vibe coding 做一个可运行 H5 MVP，不做微信小程序、APP、复杂数据库、登录、支付、后台。
- 技术决策：Next.js + TypeScript + Tailwind CSS + App Router，第一版使用本地 mock 数据和规则匹配函数，后续预留 AI 搜索 API 接入空间。
- 商业转化：结果页展示免费简版报告、¥99 完整 AI 奖学金报告、¥699 人工复核 + 申请策略咨询，按钮仅“联系顾问获取”，暂不处理付款。
- GitHub 上传偏好：用户倾向于通过 GitHub 网页端先创建公开空仓库，再把仓库 URL 发给我，由我继续配置 remote 并 push；不强制安装 GitHub CLI。
- GitHub 仓库：项目已推送到公开仓库 https://github.com/allinnb/JXJ-FOR-U.git，主分支为 main。
- 用户当前偏好：先保证完整用户流程跑通，不追求完美 UI；优先级依次为无 TypeScript 报错、无 ESLint 阻塞、手机端布局正常、表单提交后能看到个性化结果。
- 本地验证结论：`npm run lint`、`npm run build`、`npm run dev` 均已验证通过；首页 → 测评表单 → 结果页 → 咨询转化完整流程已通过浏览器端到端验证。
- UI 迭代偏好：希望产品更像可信的中文留学咨询服务，移动端优先、干净专业、轻咨询感；首页强调强转化标题，结果页强调“报告感”，CTA 和服务卡片要体现后续付费价值。
- 架构更新：已新增 `lib/aiSearch.ts`，暴露 `searchScholarshipsWithAI(userProfile)`；当前返回本地规则 mock 结果，内部 TODO 预留生成搜索关键词、搜索大学/政府/基金会官网、抽取金额/资格/截止日期、验证来源可靠性、生成匹配评分等能力；结果页通过该抽象函数获取结果，不再直接调用 matcher。
- Lead capture 更新：测评表单提交时会把用户信息保存到浏览器 `localStorage` 的 `scholarshipAssessmentLead`；结果页新增 `CopyConsultationButton`，可读取本机保存的 lead 数据并复制一段适合发给顾问微信的咨询文本，包含学历、目标国家、专业、GPA、语言、预算、奖学金偏好和系统匹配等级。
- 商业转化更新：结果页免费结果下方新增“完整报告将包含”区块，明确列出 10–20 个奖学金机会、官网链接、截止日期、资格要求、匹配评分、申请难度、推荐优先级、材料清单、申请时间线、顾问建议；新增 ¥99 完整 AI 报告与 ¥699 人工复核咨询按钮，点击仅提示“请添加顾问微信获取完整服务。”，仍不接支付。
- 第二轮产品增强完成：结果页新增 AI 参考提示、报告编号 `SCH-2026-随机6位`、生成时间、复制报告摘要、下载 PDF 占位、奖学金来源类型/可靠性/最近验证/截止日期状态/AI 置信度/人工复核建议；测评页新增 3–5 秒分析等待状态、必填校验和邮箱校验；新增 `leadQuality` hot/warm/cold 逻辑，仅用于复制给顾问的信息，不直接展示给用户。
- 埋点架构更新：新增 `lib/analytics.ts`，`trackEvent(eventName, payload)` 第一版使用 console.log + localStorage 保存最近 100 条事件；已覆盖 visit_home、click_start_assessment、submit_assessment、view_result、click_copy_consultation、click_full_report、click_human_review、click_add_wechat。
- AI 搜索规划更新：新增 `docs/AI_SEARCH_AGENT_PLAN.md`，规划未来动态搜索关键词生成、大学/政府/基金会官网搜索、字段抽取、来源验证、匹配评分、人工复核包和 provider 化接口。
- 转化率优化偏好：用户要求首页更有吸引力、表单更像测评、结果页更像正式报告，并提升添加顾问微信意愿；仍坚持不新增复杂数据库、登录、支付或后台。
- Vercel 线上测试地址历史：`https://jxj-for-u-di7k.vercel.app/` 可访问；新版转化率优化已在 `https://jxj-for-u-4xrq.vercel.app/` 核验上线。
- 内部顾问试用版架构决策：不引入 Supabase、微信登录、支付或复杂后台；前端仍为 H5，数据工作台使用飞书多维表格；顾问微信统一为 `heyiao2012`；用户提交时只跑规则 mock 初筛并立即出简版报告，AI 动态搜索通过后端接口预留给顾问手动触发。
- 内部顾问试用版实现：新增 `src/lib/config.ts`、`src/types/index.ts`、`src/lib/matcher.ts`、`src/lib/mockScholarships.ts`、`src/lib/consultationText.ts`，旧 `lib/*` 和 `types/index.ts` 改为 re-export 兼容；结果页改为从 localStorage 读取 `scholarshipUserProfile` 与 `scholarshipMatchResult`，减少长 query 依赖。
- 飞书集成预留：新增 `src/lib/feishu/client.ts`、`fieldMap.ts`、`leads.ts`、`scholarships.ts`、`aiRuns.ts` 与 `app/api/leads/route.ts`；未配置环境变量时 API 返回清晰 `success:false`，不影响用户查看报告。
- AI 手动复核预留：新增 `src/lib/ai/openrouter.ts`、`generateSearchQueries.ts`、`extractScholarshipFields.ts`、`scoreScholarshipMatch.ts`、`generateAdvisorSummary.ts`、`exa.ts`、`searchScholarshipWeb.ts` 与 `app/api/admin/run-ai-review/route.ts`；成本控制为最多 5 queries、12 URLs、8 candidates。
- 文档更新：新增 `.env.example`、`docs/FEISHU_SETUP.md`、`docs/INTERNAL_ADVISOR_WORKFLOW.md`、`docs/AI_SEARCH_ARCHITECTURE.md`。
- 内部顾问试用版本地验证：`npm run lint` 通过；`npm run build` 通过；`npm run dev` 因端口占用运行在 `http://localhost:3004`；`POST /api/leads` 在未配置飞书 env 时返回 `success:false` 和缺失变量提示，符合降级设计。
- 飞书配置讨论：用户询问企业自建应用开通权限后，是否能通过授权自动创建多维表格、数据表、字段并取得 app_token/table_id。建议结论：技术上可以部分/大部分自动化，但 MVP 首次配置仍建议手动创建 base 并自动/手动建表字段；后续可增加 `setup-feishu` 脚本或内部 setup API 自动建三张表和字段。
- 飞书自动建表实现：新增 `scripts/setup-feishu.mjs` 和 npm script `setup:feishu`；脚本读取 `.env.local` 中的 `FEISHU_APP_ID`、`FEISHU_APP_SECRET`、`FEISHU_BITABLE_APP_TOKEN`，在现有 Base 下自动创建 Leads、Scholarships、AI Runs 三张表，并把全部字段以文本类型创建，最后输出三张表 table_id。`docs/FEISHU_SETUP.md` 已补充自动建表流程。

## 2026-05-01
- 飞书配置安全提醒：用户曾在聊天中直接提供 `FEISHU_APP_SECRET`，后续应提醒其在飞书开放平台重置/轮换该 Secret，并只放入 `.env.local` 或 Vercel 环境变量，不要提交到 GitHub。
- 飞书 setup 排查：本地 `.env.local` 已写入飞书配置且被 `.gitignore` 忽略；`setup-feishu.mjs` 已兼容带 query 的 `FEISHU_BITABLE_APP_TOKEN`，会自动取 `?` 前 token。
- 运行 `npm run setup:feishu` 时 token 获取成功，但创建数据表返回 `Forbidden`，当前判断为应用缺少多维表格/base 读写权限、权限未发布，或应用未被添加为该 Base 的可编辑协作者。
- 用户再次要求运行 `npm run setup:feishu`；脚本仍在创建 `Leads` 数据表时返回 `Forbidden (/open-apis/bitable/v1/apps/ICD6bEPS3a6brpslmV8cUD65nxb/tables)`，进一步确认不是代码语法/环境变量缺失问题，而是飞书 Base 权限、应用协作者、权限范围或应用发布状态问题。
- 用户反馈企业自建应用无法被添加为已有 Base 的可编辑协作者，因此选择“改成全自动”路线。已改造 `scripts/setup-feishu.mjs` 支持 `FEISHU_SETUP_MODE=create-base`，可自动创建新的飞书多维表格 Base，再创建 Leads、Scholarships、AI Runs 三张表和全部文本字段。
- 使用 `FEISHU_SETUP_MODE=create-base npm run setup:feishu` 已成功创建新 Base：`AI 奖学金匹配助手 - 顾问工作台`，新 `FEISHU_BITABLE_APP_TOKEN=HFD5bJChOaVYl8sWDegcaWMZnIA`，表 ID 为 `FEISHU_LEADS_TABLE_ID=tblBRlgBEVL5v1xq`、`FEISHU_SCHOLARSHIPS_TABLE_ID=tblt8OVCvgm2gKXt`、`FEISHU_AI_RUNS_TABLE_ID=tblZFPveSOBPmS6d`；已写入本地 `.env.local`。
- 飞书记录写入测试：首次 `/api/leads` 返回 `TextFieldConvFail`，原因是飞书文本字段不接受 boolean/array 原始值；已在 `src/lib/feishu/client.ts` 中统一把所有字段归一化为文本（boolean 转“是/否”、array 换行拼接、object JSON.stringify）。再次测试 `POST /api/leads` 成功返回 `{ success: true, reportId: "SCH-2026-TEST02" }`。
- 当前验证：`npm run lint` 通过，`npm run build` 通过；本地 dev 服务运行在 `http://localhost:3005`。
- 最新重复需求核验：用户再次给出“内部顾问小范围试用版”完整需求后，已重新核验当前实现，`npm run lint` 通过、`npm run build` 通过、`npm run dev` 启动在 `http://localhost:3006`；本地首页和测评页 smoke check 200，结果页无 localStorage 时走引导降级。
- 飞书新 Base 链接：Leads 表 `https://feishu.cn/base/HFD5bJChOaVYl8sWDegcaWMZnIA?table=tblBRlgBEVL5v1xq`；Scholarships 表 `https://feishu.cn/base/HFD5bJChOaVYl8sWDegcaWMZnIA?table=tblt8OVCvgm2gKXt`；AI Runs 表 `https://feishu.cn/base/HFD5bJChOaVYl8sWDegcaWMZnIA?table=tblZFPveSOBPmS6d`。
- OpenRouter/Exa 安全提醒：用户曾在聊天中明文提供 OpenRouter API Key 和 Exa API Key；后续应建议用户在 OpenRouter/Exa 后台重置或轮换，并只放入 `.env.local` / Vercel 环境变量，不提交 GitHub。
- AI 复核联调结论：Exa Search/Contents 已真实跑通；OpenRouter API Key 可用。`google/gemma-4-31b-it:free` 曾返回 upstream 429 限流，本地临时用 `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free` 同时作为 fast/strong 模型跑通 `/api/admin/run-ai-review`。已增强 query fallback、单页抽取/评分容错、Exa fallback candidates、字段规范化和成本控制。
- 线上部署准备：已将内部顾问版与 AI 手动复核代码提交为 `ef95fd1 Add internal advisor AI review workflow.` 并推送到 GitHub `allinnb/JXJ-FOR-U` 的 `main` 分支；推送前 `npm run lint` 与 `npm run build` 均通过。
- Vercel 部署限制：当前环境没有 Vercel CLI（`vercel: command not found`），浏览器工具打开 Vercel Dashboard 失败（Chrome debugger 未启动），因此未能代用户直接写入 Vercel 环境变量；需要用户在 Vercel 项目 Settings → Environment Variables 手动配置 OpenRouter/Exa/飞书变量并 Redeploy。
- 线上 `https://jxj-for-u-em47.vercel.app/` 已检测：首页和测评页均为新版；`POST /api/admin/run-ai-review` 返回 `success:true` 并可生成 Exa/AI 候选奖学金，说明 OpenRouter/Exa 线上接口基本可执行；但 `POST /api/leads` 返回缺少 `FEISHU_BITABLE_APP_TOKEN`，说明该 Vercel Deployment 未配置或未生效飞书环境变量，飞书同步闭环尚未打通。
- 线上 `https://jxj-for-u-em47.vercel.app/` 重新检测：`POST /api/leads` 已返回 `{success:true, reportId:"SCH-2026-ONTEST"}`，说明 Vercel 飞书同步环境变量已生效，Leads/Scholarships 写入闭环跑通；`POST /api/admin/run-ai-review` 已返回 `{success:true}`、runId 与候选奖学金，说明线上 OpenRouter/Exa AI 复核可执行。仍建议用户轮换已在聊天中暴露的飞书/OpenRouter/Exa 密钥。


## 2026-05-01 自动提取
- 新版网站 https://jxj-for-u-cqkk.vercel.app/ 部署成功，所有主要优化已上线。
- 线上全链路跑通确认：`https://jxj-for-u-xjkc.vercel.app/` 已通过完整测试——飞书 Leads/Scholarships 同步成功、AI 复核返回真实候选（Durham University Business Analytics Scholarships 等）、OpenRouter 和 Exa 线上均可用。
- 结果页同步状态 bug 修复：表单提交后 localStorage 初始状态为 `success:false` 导致误判失败，已改为三态（pending/success/failed）+ 轮询机制。
- 当前系统完整能力：用户测评→简版报告→飞书同步→顾问在飞书查看→顾问通过 /admin 触发 AI 复核→返回真实候选奖学金。AI 复核结果暂未自动合并为用户可见完整报告，也未自动写入 Scholarships 表。
- Admin 密码 `jxj2026` 硬编码在客户端组件中，`ADMIN_API_KEY` 环境变量未设置时不校验 header key。
