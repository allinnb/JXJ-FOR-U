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

### 不包含
- ⬜ 登录系统
- ⬜ 支付系统
- ⬜ 后台管理系统
- ⬜ 复杂数据库
- ⬜ 实时奖学金搜索 API

## 页面结构
1. 首页 `/`
   - 标题、副标题、CTA
   - 流程展示：填写背景 → AI 匹配 → 获取报告 → 人工复核/申请辅导
   - 适合人群展示

2. 测评表单页 `/assessment`
   - 收集学历、国家、专业、GPA、语言、经历、预算、奖学金偏好、人工辅导需求、微信号和邮箱等信息
   - 提交后跳转结果页

3. 结果报告页 `/result`
   - 用户背景摘要
   - 整体匹配评级：高 / 中 / 低
   - 推荐国家方向
   - 3 个 mock 奖学金推荐
   - 风险提示、下一步建议
   - 完整报告与人工服务转化

## 代码结构
- `app/page.tsx`
- `app/assessment/page.tsx`
- `app/result/page.tsx`
- `components/PageShell.tsx`
- `components/CTASection.tsx`
- `lib/mockScholarships.ts`
- `lib/matcher.ts`
- `types/index.ts`

## 商业转化设计
结果页底部服务卡片：
1. 免费简版报告
2. ¥99 完整 AI 奖学金报告
3. ¥699 人工复核 + 申请策略咨询

第一版只展示“联系顾问获取”按钮，不处理付款。

## 当前里程碑
- ✅ 项目需求整理
- ✅ MVP 任务拆解
- ✅ Next.js 项目初始化
- ✅ 首页开发
- ✅ 测评表单页开发
- ✅ 结果报告页开发
- ✅ Mock 数据与匹配逻辑开发
- ✅ 本地运行验证（`npm run build` 成功）

## 后续建议
- ⬜ 将 URL query 临时传参升级为本地存储或轻量 API route，减少结果页链接过长的问题。
- ⬜ 替换 `mailto:consultant@example.com` 为真实顾问微信/企微/表单链接。
- ⬜ 接入 AI 搜索 API 前，先定义统一的 ScholarshipSearchProvider 接口。
- ⬜ 增加官网链接真实性校验、截止日期字段、材料清单字段。
