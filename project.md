# AI Scholarship Matcher / AI 留学奖学金匹配助手

## 项目定位
用 vibe coding 的方式快速搭建一个可运行的 H5 MVP，帮助准备出国留学的中国学生根据个人背景生成奖学金匹配报告。

## 目标用户
- 准备申请海外本科、硕士、博士、交换项目的中国学生
- 预算有限、希望提高奖学金机会的家庭
- 需要人工复核、申请策略和材料辅导的潜在咨询客户

## MVP 范围
### 包含
- ✅ Next.js + TypeScript + Tailwind CSS + App Router
- ✅ 手机端优先 H5 页面
- ✅ 首页
- ✅ 测评表单页
- ✅ 结果报告页
- ✅ 咨询转化区块
- ✅ 本地 mock 奖学金数据
- ✅ 可替换的 matcher 规则层，方便后续接入 AI 搜索 API
- ✅ `lib/aiSearch.ts` AI 动态搜索抽象层预留
- ✅ `docs/AI_SEARCH_AGENT_PLAN.md` AI 动态搜索代理规划文档
- ✅ 可信留学咨询风格 UI 优化
- ✅ 本地 lead capture：表单提交后保存到 localStorage
- ✅ 结果页“复制咨询信息 / 复制给顾问 / 复制报告摘要”按钮
- ✅ 表单提交 3–5 秒分析等待体验
- ✅ 基础埋点接口：console.log + localStorage 保存
- ✅ 结果页错误兜底：无用户信息时引导回测评页

### 不包含
- ⬜ 登录系统
- ⬜ 支付系统
- ⬜ 后台管理系统
- ⬜ 复杂数据库
- ⬜ 实时奖学金搜索 API

## 页面结构
1. 首页 `/`
   - 强转化标题：2 分钟生成海外奖学金机会初筛报告
   - CTA：开始免费测评
   - 流程展示：填写背景 → 规则 / AI 初筛 → 生成报告 → 顾问复核
   - 适合人群与痛点展示

2. 测评表单页 `/assessment`
   - 收集学历、国家、专业、GPA、语言、经历、预算、奖学金偏好、人工辅导需求、微信号和邮箱等信息
   - 必填校验、邮箱格式校验
   - 提交后将测评信息保存到浏览器 localStorage
   - 提交后展示 3–5 秒分析状态，再跳转结果页

3. 结果报告页 `/result`
   - 顶部提示：AI 结果仅供参考，以官网和人工复核为准
   - 报告封面、报告编号、生成时间、匹配评级和综合匹配分
   - 用户背景摘要
   - 推荐国家方向
   - 3 个 mock 奖学金推荐
   - 每个推荐展示来源类型、来源可靠性、最近验证时间、截止日期状态、AI 置信度、是否建议人工复核
   - 风险提示、下一步建议
   - 复制报告摘要按钮
   - 下载 PDF 占位按钮
   - 复制给顾问按钮：包含线索等级、推荐跟进方式和适合推荐的服务套餐
   - 完整报告与人工服务转化

## 代码结构
- `app/page.tsx`
- `app/assessment/page.tsx`
- `app/result/page.tsx`
- `components/PageShell.tsx`
- `components/CTASection.tsx`
- `components/CopyConsultationButton.tsx`
- `components/ServiceActionButton.tsx`
- `components/AnalyticsLink.tsx`
- `components/AddWechatLink.tsx`
- `components/DownloadPdfPlaceholderButton.tsx`
- `components/HomeVisitTracker.tsx`
- `components/ResultPageClientEvents.tsx`
- `lib/mockScholarships.ts`
- `lib/matcher.ts`
- `lib/aiSearch.ts`
- `lib/analytics.ts`
- `types/index.ts`
- `docs/AI_SEARCH_AGENT_PLAN.md`

## AI 搜索接口预留
- `lib/aiSearch.ts` 暴露 `searchScholarshipsWithAI(userProfile)`。
- 当前先调用 `matchScholarships(userProfile)` 返回本地 mock/rule-based 结果。
- 已用 TODO 预留未来能力：
  1. 生成搜索关键词
  2. 搜索大学官网、政府官网、基金会官网
  3. 抽取奖学金金额、资格、截止日期
  4. 验证来源可靠性
  5. 生成匹配评分
- `docs/AI_SEARCH_AGENT_PLAN.md` 已写清楚未来如何接入动态搜索、来源验证、匹配评分和人工复核流程。
- `app/result/page.tsx` 已通过该抽象函数获取报告结果，方便未来接入 OpenAI API、搜索 API 或人工复核流程。

## Lead Capture 设计
- `app/assessment/page.tsx` 在表单提交时将所有字段保存到 localStorage：`scholarshipAssessmentLead`。
- `components/CopyConsultationButton.tsx` 在结果页读取 localStorage，并和当前结果页 form 数据合并。
- 用户可复制报告摘要，也可复制完整自然语言顾问咨询文本。
- 复制给顾问的信息包括：当前学历、目标学历、目标国家、专业方向、GPA、语言成绩、预算、奖学金偏好、系统匹配等级、整体匹配分、线索等级、推荐跟进方式、适合推荐的服务套餐。
- `leadQuality` 逻辑已在 `lib/matcher.ts` 内实现，分为 hot / warm / cold；不在用户界面直接展示，仅进入复制给顾问的信息。
- 当前不接入数据库，符合轻量 MVP 范围；未来可以替换为 API route、CRM、飞书表格或顾问后台。

## 埋点设计
- `lib/analytics.ts` 暴露 `trackEvent(eventName, payload)`。
- 第一版使用 `console.log` + localStorage 保存最近 100 条事件。
- 已覆盖事件：visit_home、click_start_assessment、submit_assessment、view_result、click_copy_consultation、click_full_report、click_human_review、click_add_wechat。

## 商业转化设计
结果页底部服务卡片：
1. 免费简版报告：方向判断、3 个机会、关键风险
2. ¥99 完整 AI 奖学金报告：10–20 个机会、截止日期、官网链接、材料清单、优先级排序
3. ¥699 人工复核 + 申请策略咨询：官网人工核验、申请组合策略、材料与时间线建议

第一版只展示“联系顾问获取”或弹窗提示，不处理付款。

## 当前里程碑
- ✅ 项目需求整理
- ✅ MVP 任务拆解
- ✅ Next.js 项目初始化
- ✅ 首页开发
- ✅ 测评表单页开发
- ✅ 结果报告页开发
- ✅ Mock 数据与匹配逻辑开发
- ✅ AI 动态搜索接口结构预留（`lib/aiSearch.ts`）
- ✅ AI 搜索代理规划文档（`docs/AI_SEARCH_AGENT_PLAN.md`）
- ✅ 可信留学咨询风格 UI 优化
- ✅ Lead capture 与复制咨询信息功能
- ✅ 第二轮产品增强：可信度、报告感、线索质量、咨询话术、等待体验、埋点、错误兜底
- ✅ 本地运行验证（`npm run build` 成功）
- ✅ 本地开发服务验证（`npm run dev` 可正常运行）
- ✅ ESLint 验证（`npm run lint` 无 warning/error）
- ✅ 首页 → 测评表单 → 结果页 → 咨询转化端到端流程验证通过

## 后续建议
- ✅ 将 URL query 临时传参升级为本地存储或轻量 API route，减少结果页链接过长的问题。（已先完成 localStorage 版本，仍保留 URL query 兼容）
- ✅ 增加官网链接真实性校验、截止日期字段、材料清单字段的结构预留。
- ⬜ 替换 `mailto:consultant@example.com` 为真实顾问微信/企微/表单链接。
- ⬜ 将 `lib/aiSearch.ts` 进一步扩展为统一的 ScholarshipSearchProvider 接口。
- ⬜ 使用 Vercel 或 Netlify 导入 GitHub 仓库，完成线上测试部署。
