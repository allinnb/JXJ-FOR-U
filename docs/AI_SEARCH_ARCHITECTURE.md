# AI 搜索复核架构说明

## 1. 为什么使用 OpenRouter + Exa
OpenRouter 负责大模型推理、结构化抽取和匹配评分；Exa 负责搜索和获取网页正文。两者组合可以减少纯大模型幻觉，并保留来源证据链。

## 2. OpenRouter 负责什么
- 根据用户资料生成英文搜索 query
- 从网页正文抽取奖学金字段
- 进行用户背景与奖学金机会的匹配评分
- 生成顾问内部摘要

## 3. Exa 负责什么
- 根据 query 搜索候选网页
- 获取网页正文内容
- 帮助优先找到大学官网、政府官网、基金会官网和国际组织官网

## 4. 为什么不只用大模型
奖学金信息高度依赖官网来源、截止日期和资格要求。只用大模型容易编造金额、截止日期或资格条件，因此必须结合搜索和来源验证。

## 5. 为什么不在用户提交时自动运行 AI 搜索
当前是内部顾问小范围试用版，自动搜索会带来：
- 响应时间变长
- API 成本不可控
- 搜索结果未经人工复核，容易被用户误解为正式承诺

因此用户提交时只生成规则 mock 初筛报告；顾问确认有跟进价值后，再手动触发 AI 复核。

## 6. 成本控制策略
当前后端接口限制：
- 最多 5 条 query
- 每条 query 最多 5 个搜索结果
- 去重后最多处理 12 个 URL
- 最多返回 8 个候选奖学金

## 7. 搜索证据链字段
增强版 ScholarshipEvidence 包含：
- sourceTitle
- sourceSnippet
- sourceTextExcerpt
- deadlineRawText
- eligibilityRawText
- lastFetchedAt

这些字段用于顾问复核，不应直接当作最终申请承诺。

## 8. 人工复核流程
1. 用户提交测评，生成 draft_mock 报告。
2. 数据写入飞书 Leads 和 Scholarships。
3. 顾问查看用户背景和 mock 推荐。
4. 对高价值线索手动触发 AI 搜索复核。
5. 顾问检查 evidence、官网链接、deadline 和 eligibility。
6. 顾问更新飞书中的判断、优先级、备注和跟进状态。
7. 再向用户推荐 ¥99 完整报告或 ¥699 人工复核咨询。

## 9. 后续如何迁移到 Supabase 或正式后台
当前飞书多维表格承担轻量工作台角色。未来若需要正式后台，可迁移：
- Leads → users/leads 数据表
- Scholarships → report_scholarships 数据表
- AI Runs → ai_runs 数据表
- 顾问备注和状态 → CRM workflow

迁移时保留现有 API route 契约即可，前端 H5 流程不必大改。
