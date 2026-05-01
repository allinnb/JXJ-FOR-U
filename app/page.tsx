import { AddWechatLink } from "@/components/AddWechatLink";
import { AnalyticsLink } from "@/components/AnalyticsLink";
import { CTASection } from "@/components/CTASection";
import { HomeVisitTracker } from "@/components/HomeVisitTracker";
import { PageShell } from "@/components/PageShell";
import { CONSULTANT_WECHAT, TRUST_DISCLAIMER } from "@/src/lib/config";

const steps = [
  { title: "填写背景", desc: "目标学历、国家、专业、入学时间和预算" },
  { title: "生成初筛报告", desc: "根据 GPA、语言、经历和奖学金偏好判断方向" },
  { title: "顾问复核", desc: "同步到飞书工作台，顾问核验官网和资格条件" },
  { title: "申请策略建议", desc: "判断优先级、材料清单和后续申请节奏" },
];

const audiences = ["本科申请", "硕士申请", "博士申请", "交换/访学", "预算有限", "想申请奖学金"];

const sampleReport = [
  { label: "高匹配机会", value: "英国/欧洲院校奖学金、政府类国际学生奖学金", tone: "bg-green-50 text-green-800 ring-green-100" },
  { label: "中匹配机会", value: "学费减免、学院奖、非热门地区专项资助", tone: "bg-blue-50 text-brand-700 ring-blue-100" },
  { label: "主要风险", value: "截止日期、GPA 换算、语言小分、奖学金覆盖范围需核验", tone: "bg-amber-50 text-amber-900 ring-amber-100" },
  { label: "建议方向", value: "先扩展 10–20 个机会池，再由顾问筛出优先申请组合", tone: "bg-slate-100 text-slate-800 ring-slate-200" },
];

const testimonials = [
  { name: "李同学", bg: "211 本科 · GPA 3.6", feedback: "报告帮我发现了之前完全不知道的英国 GREAT 奖学金，节省了很多搜索时间。", tag: "英国硕士申请" },
  { name: "张同学", bg: "双非本科 · 均分 85", feedback: "顾问复核后帮我梳理了 3 个冲刺 + 2 个保底的奖学金组合，申请策略很清晰。", tag: "欧洲硕士申请" },
  { name: "王同学", bg: "985 本科 · GPA 3.8", feedback: "本来觉得预算不够出国，结果发现 DAAD 和 Erasmus 都有全奖项目。", tag: "德国/欧洲申请" },
];

export default function HomePage() {
  return (
    <PageShell>
      <HomeVisitTracker />
      <section className="mx-auto max-w-6xl px-5 pb-14 pt-8 md:pt-12">
        {/* Hero */}
        <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-stretch">
          <div className="rounded-[2.2rem] bg-white/90 p-7 shadow-soft ring-1 ring-slate-100 md:p-12">
            <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-brand-700 ring-1 ring-blue-100">
              AI Scholarship Matcher · 内部顾问试用版
            </span>
            <h1 className="mt-5 text-4xl font-black leading-[1.08] tracking-tight text-slate-950 md:text-6xl">
              测一测你的背景，适合申请哪些海外奖学金？
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
              输入 GPA、目标国家、专业和预算，AI 为你初筛可申请的奖学金方向，并由顾问提供官网核验与申请策略建议。
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <AnalyticsLink href="/assessment" eventName="click_start_assessment" className="rounded-2xl bg-brand-600 px-6 py-4 text-center text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-brand-700">
                开始免费测评
              </AnalyticsLink>
              <a href="#sample-report" className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-center text-sm font-black text-slate-800 transition hover:border-brand-200 hover:text-brand-700">
                查看样例报告
              </a>
            </div>
            {/* Social proof counter */}
            <div className="mt-5 flex items-center gap-3 text-sm text-slate-600">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-xs font-black text-green-700">✓</span>
              <span><strong className="text-slate-900">156 位同学</strong>已获取奖学金初筛报告</span>
            </div>
            {/* Consultant info */}
            <div className="mt-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
              <p className="text-sm font-black text-slate-950">顾问微信：{CONSULTANT_WECHAT}</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">5 年留学咨询经验 · 已帮助 200+ 位学生申请奖学金 · 如需人工复核，可复制微信添加顾问。</p>
              <AddWechatLink payload={{ source: "home_hero" }} className="mt-3 rounded-xl bg-slate-950 px-4 py-2 text-xs font-black text-white">
                复制顾问微信
              </AddWechatLink>
            </div>
            <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-xs font-bold leading-5 text-amber-900 ring-1 ring-amber-100">{TRUST_DISCLAIMER}</p>
          </div>

          <aside id="sample-report" className="rounded-[2.2rem] bg-slate-950 p-6 text-white shadow-soft md:p-8">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-blue-200">样例报告预览</p>
                <h2 className="mt-2 text-2xl font-black">免费初筛会看到什么？</h2>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-950">Demo</span>
            </div>
            <div className="mt-5 grid gap-3">
              {sampleReport.map((item) => (
                <div key={item.label} className={`rounded-3xl p-4 ring-1 ${item.tone}`}>
                  <p className="text-xs font-black">{item.label}</p>
                  <p className="mt-1 text-sm font-bold leading-6">{item.value}</p>
                </div>
              ))}
            </div>
            <AnalyticsLink href="/assessment" eventName="click_start_assessment" className="mt-6 block rounded-2xl bg-white px-5 py-4 text-center text-sm font-black text-slate-950 transition hover:-translate-y-0.5">
              立即生成我的报告
            </AnalyticsLink>
          </aside>
        </div>

        {/* 4-step process */}
        <section id="process" className="mt-10">
          <p className="text-sm font-black text-brand-600">How it works</p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">从测评到申请策略的 4 步</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-sm font-black text-brand-700 ring-1 ring-blue-100">{index + 1}</div>
                <h3 className="mt-4 text-base font-black text-slate-950">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Audiences + Pain points */}
        <section className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h2 className="text-xl font-black text-slate-950">适合人群</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {audiences.map((item) => (
                <span key={item} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 ring-1 ring-slate-200">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h2 className="text-xl font-black text-slate-950">为什么建议先测一测？</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {["官网信息分散，截止日期容易遗漏", "不同奖学金覆盖范围差异很大", "GPA 和语言要求需要逐项核验", "顾问可帮助判断申请投入是否值得"].map((item) => (
                <div key={item} className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold leading-6 text-amber-950 ring-1 ring-amber-100">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="mt-10">
          <p className="text-sm font-black text-brand-600">Student Feedback</p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">同学怎么说</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {testimonials.map((item) => (
              <div key={item.name} className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-100">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-sm font-black text-white">{item.name[0]}</div>
                  <div>
                    <p className="text-sm font-black text-slate-950">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.bg}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-700">&ldquo;{item.feedback}&rdquo;</p>
                <span className="mt-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-brand-700">{item.tag}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Service expansion: 3 business lines */}
        <section className="mt-10">
          <p className="text-sm font-black text-brand-600">Our Services</p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">不只是奖学金，我们覆盖你的全程规划</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-xl">🎓</div>
              <h3 className="mt-4 text-lg font-black text-slate-950">升学规划</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">从选校定位、文书指导到申请材料复核，帮你构建有竞争力的申请组合。</p>
              <AnalyticsLink href="/assessment" eventName="click_start_assessment" className="mt-4 inline-flex text-sm font-black text-brand-600">了解详情 →</AnalyticsLink>
            </div>
            <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-xl">🏆</div>
              <h3 className="mt-4 text-lg font-black text-slate-950">奖学金申请</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">AI 初筛 + 顾问人工复核，帮你找到 10–20 个值得申请的奖学金机会。</p>
              <AnalyticsLink href="/assessment" eventName="click_start_assessment" className="mt-4 inline-flex text-sm font-black text-brand-600">免费测评 →</AnalyticsLink>
            </div>
            <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-xl">✈️</div>
              <h3 className="mt-4 text-lg font-black text-slate-950">签证服务</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">已拿到 offer？我们提供签证材料准备、面签辅导和入境指导一站式服务。</p>
              <AddWechatLink payload={{ source: "home_visa" }} className="mt-4 inline-flex text-sm font-black text-brand-600">咨询顾问 →</AddWechatLink>
            </div>
          </div>
        </section>

        <div className="mt-10">
          <CTASection />
        </div>
      </section>
    </PageShell>
  );
}
