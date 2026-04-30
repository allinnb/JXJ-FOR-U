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
- 本次确认：商业转化功能已存在于 `app/result/page.tsx` 和 `components/ServiceActionButton.tsx`，并重新通过 `npm run lint` 与 `npm run build` 验证。
- 第二轮产品增强完成：结果页新增 AI 参考提示、报告编号 `SCH-2026-随机6位`、生成时间、复制报告摘要、下载 PDF 占位、奖学金来源类型/可靠性/最近验证/截止日期状态/AI 置信度/人工复核建议；测评页新增 3–5 秒分析等待状态、必填校验和邮箱校验；新增 `leadQuality` hot/warm/cold 逻辑，仅用于复制给顾问的信息，不直接展示给用户。
- 埋点架构更新：新增 `lib/analytics.ts`，`trackEvent(eventName, payload)` 第一版使用 console.log + localStorage 保存最近 100 条事件；已覆盖 visit_home、click_start_assessment、submit_assessment、view_result、click_copy_consultation、click_full_report、click_human_review、click_add_wechat。
- AI 搜索规划更新：新增 `docs/AI_SEARCH_AGENT_PLAN.md`，规划未来动态搜索关键词生成、大学/政府/基金会官网搜索、字段抽取、来源验证、匹配评分、人工复核包和 provider 化接口。
- 第二轮验证结论：`npm run lint` 通过，`npm run build` 通过，`npm run dev` 可运行；因 3000/3001 被占用，本次开发服务运行在 `http://localhost:3002`，并用 Node fetch 验证首页和结果页关键内容返回正常。
