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
- UI 迭代偏好：希望产品更像可信的中文留学咨询服务，移动端优先、干净专业、轻咨询感；首页强调强转化标题，结果页强调“报告感”，CTA 和服务卡片要体现后续付费价值。
- 架构更新：已新增 `lib/aiSearch.ts`，暴露 `searchScholarshipsWithAI(userProfile)`；当前返回本地规则 mock 结果，内部 TODO 预留生成搜索关键词、搜索大学/政府/基金会官网、抽取金额/资格/截止日期、验证来源可靠性、生成匹配评分等能力；结果页通过该抽象函数获取结果，不再直接调用 matcher。
- 内部顾问试用版架构决策：不引入 Supabase、微信登录、支付或复杂后台；前端仍为 H5，数据工作台使用飞书多维表格；顾问微信统一为 `heyiao2012`；用户提交时只跑规则 mock 初筛并立即出简版报告，AI 动态搜索通过后端接口预留给顾问手动触发。
- 飞书集成与自动化：已实现飞书 Leads、Scholarships、AI Runs 三表写入；`scripts/setup-feishu.mjs` 支持自动创建 Base 和字段。当前新 Base token 为 `HFD5bJChOaVYl8sWDegcaWMZnIA`，Leads `tblBRlgBEVL5v1xq`，Scholarships `tblt8OVCvgm2gKXt`，AI Runs `tblZFPveSOBPmS6d`。
- 安全提醒：用户曾在聊天中明文提供飞书 App Secret、OpenRouter API Key、Exa API Key；后续需要持续提醒其在各平台重置/轮换，并只放入 `.env.local` 或 Vercel 环境变量，不提交 GitHub。
- AI 复核联调：Exa Search/Contents 已跑通；OpenRouter 可用，`google/gemma-4-31b-it:free` 曾 429 限流，建议使用 `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free` 或稳定付费模型。`/api/admin/run-ai-review` 支持 query fallback、单页抽取/评分容错、候选规范化和成本控制。
- 线上核心闭环：`https://jxj-for-u-l7pq.vercel.app/` 已验证用户测评→飞书 Leads/Scholarships 同步→顾问 /admin 触发 AI 复核→AI 候选自动写入 Scholarships 表→AI Runs 记录成功。
- 付费报告交付：已开发 `/api/admin/generate-full-report`、`/report/[reportId]`、`src/lib/feishu/reports.ts`。顾问可在客户付款后触发 AI 复核、在飞书核验候选、生成 `/report/{reportId}` 完整报告链接发给客户。
- 首页转化优化方向：用户采纳外部建议，重点强化首屏 CTA、动态社交证明、30 秒低门槛测评说明、微信复制/二维码引流、专业报告样例预览与 SEO 标题描述。

## 2026-05-01
- 最新首页落地页优化已完成：首屏 CTA 改为“立即生成我的奖学金报告”；新增“仅需 30 秒 / 免费出简版 / 顾问可复核”三项低门槛说明；增加实时滚动 social proof 动态条；样例报告预览卡片更像正式报告缩略图，展示官网链接、截止日期、资格要求、AI 置信度、申请难度、推荐优先级等字段。
- 微信引流增强：首页新增“点击复制微信号”按钮和二维码视觉占位卡片，当前只是占位图形，后续若用户提供真实顾问二维码，可替换为可长按识别的图片。
- SEO 优化：`app/layout.tsx` title 改为“AI 奖学金匹配 - 30秒自测你的海外留学奖学金申请背景”，description 增加全奖/半奖、211/985、双非等关键词，并同步 keywords 与 OG 文案。
- 验证与发布：`npm run lint`、`npm run build` 均通过；提交 `7684608 Optimize landing page conversion messaging.` 已推送到 GitHub main。
- 用户提供私人微信二维码图片，已复制到 `public/consultant-wechat.jpg` 并替换首页“顾问人工复核入口”的二维码视觉占位；首页现在展示真实二维码，保留“点击复制微信号”和“长按二维码识别 / 扫码添加”提示。