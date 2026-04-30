# AI Search Agent Plan / 奖学金动态搜索代理规划

## 目标

将当前 `lib/aiSearch.ts` 中的 mock/rule-based 结果，逐步升级为可动态搜索、可验证来源、可生成匹配评分、可交给顾问复核的奖学金搜索代理。

第一版仍不引入复杂数据库、登录、支付或后台，优先保持 H5 MVP 可运行。

## 当前抽象层

- 入口函数：`searchScholarshipsWithAI(userProfile)`
- 当前行为：调用 `matchScholarships(userProfile)` 返回本地 mock 数据
- 未来职责：统一封装搜索、抽取、验证、评分和人工复核交接

## 建议的数据流

```txt
用户测评信息
  ↓
生成搜索关键词
  ↓
搜索高可信来源
  ↓
抽取奖学金字段
  ↓
来源可靠性验证
  ↓
匹配评分与风险生成
  ↓
返回简版报告 / 完整报告 / 顾问复核包
```

## 1. 生成搜索关键词

根据用户字段生成多组查询：

- 目标国家 / 地区
- 目标学历：本科、硕士、博士、交换
- 专业方向
- 奖学金偏好：全奖、半奖、学费减免、生活补助
- 入学季与年份
- 学校背景、GPA、语言成绩

示例关键词：

```txt
UK masters scholarship tuition waiver business 2026 international students official
Erasmus Mundus scholarship data science 2026 application deadline official
Canada graduate funding PhD computer science international students university official
```

## 2. 搜索来源优先级

优先搜索并保留以下来源：

1. 大学官网：`.edu`、`.ac.uk`、大学官方 scholarship/funding 页面
2. 政府官网：教育部、文化委员会、国家奖学金官网
3. 基金会官网：奖学金项目运营方、公益基金会
4. 项目官网：联合硕士、研究项目、区域合作项目
5. 低优先级：博客、中介聚合页、论坛，仅作为线索，不直接入报告

## 3. 抽取字段

每条奖学金至少抽取：

- 奖学金名称
- 国家/地区
- 来源 URL
- 来源类型
- 适合学历阶段
- 适合专业方向
- 奖学金类型
- 金额/覆盖范围
- 资格要求
- 截止日期
- 截止日期状态
- 申请材料清单
- 申请难度
- 匹配理由
- 风险提示
- 最近验证时间

## 4. 来源验证策略

每个机会输出来源可靠性：

- 高：大学、政府、基金会或官方项目页面，字段清晰
- 中：官方来源存在，但金额/截止日期/资格字段缺失，需要二次确认
- 待核验：来源不完整、页面过旧、只有聚合页或疑似过期

验证动作：

- 检查 URL 域名是否为官方域名
- 检查页面标题与奖学金名称是否一致
- 检查页面是否包含 deadline / eligibility / amount / how to apply
- 检查更新时间或页面年度
- 对关键字段打置信度

## 5. 匹配评分设计

建议采用 100 分制：

- 学术匹配：GPA、学校背景、科研/实习/竞赛经历
- 语言匹配：总分、小分、有效期
- 国家与专业匹配：目标国家、专业方向、项目可用性
- 预算匹配：全奖/半奖/学费减免/生活补助的覆盖度
- 时间匹配：距离截止日期是否足够准备材料
- 风险扣分：来源不可靠、资格不清晰、竞争极高、需要导师套磁

输出：

- `overallMatchScore`
- `matchLevel`
- 单个奖学金 `aiConfidence`
- `risks`
- `nextSteps`

## 6. 人工复核流程

当出现以下情况时，建议标记 `needsHumanReview = true`：

- 全奖或高额资助
- 博士/研究型项目
- 截止日期即将到来
- 官网信息不完整
- 用户预算非常有限
- 用户明确选择需要人工辅导
- AI 置信度低于 85%

顾问复核包应包含：

- 用户背景摘要
- 系统匹配等级
- 推荐机会列表
- 每条机会的官网链接与待核验字段
- 线索等级 `leadQuality`
- 推荐跟进方式
- 适合推荐的服务套餐

## 7. 未来接口建议

可以将 `lib/aiSearch.ts` 扩展为 provider 结构：

```ts
interface ScholarshipSearchProvider {
  search(userProfile: AssessmentFormData): Promise<MatchResult>;
}
```

可选实现：

- `MockSearchProvider`：当前本地 mock
- `AISearchProvider`：OpenAI + 搜索 API
- `HumanReviewProvider`：顾问手动补充/复核
- `HybridSearchProvider`：AI 初筛 + 人工确认

## 8. MVP 到正式版的迭代顺序

1. 保留当前 mock 逻辑，完善 UI 与转化链路
2. 增加搜索 API，只返回候选 URL
3. 用 AI 抽取字段并生成结构化 JSON
4. 增加来源可靠性验证
5. 增加人工复核入口和导出顾问复核包
6. 接入轻量存储或 CRM/飞书表格
7. 再考虑登录、支付、后台管理
