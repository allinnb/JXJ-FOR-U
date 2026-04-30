import { AnalyticsLink } from "@/components/AnalyticsLink";
import { CTASection } from "@/components/CTASection";
import { HomeVisitTracker } from "@/components/HomeVisitTracker";
import { PageShell } from "@/components/PageShell";

const steps = [
  { title: "填写背景", desc: "学历、目标国家、专业、GPA、语言和预算" },
  { title: "规则 / AI 初筛", desc: "先用本地规则匹配，后续可接入动态搜索" },
  { title: "生成报告", desc: "输出评级、推荐方向、机会清单和风险提示" },
  { title: "顾问复核", desc: "核验官网、截止日期、材料清单与申请策略" },
];

const audiences = ["本科申请", "硕士申请", "博士申请", "交换/访学", "预算有限", "想申请奖学金"];

const highlights = [
  { value: "2 分钟", label: "完成背景测评" },
  { value: "3 个", label: "免费初筛机会" },
  { value: "10–20 个", label: "完整报告机会池" },
];

const painPoints = [
  "不知道哪些国家更容易拿奖",
  "官网信息分散，截止日期容易遗漏",
  "不确定 GPA、语言和背景是否够竞争",
  "需要有人帮你判断申请投入是否值得",
];

export default function HomePage() {
  return (
    <PageShell>
      <HomeVisitTracker />
      <section className="mx-auto max-w-6xl px-5 pb-14 pt-8 md:pt-12">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
          <div className="rounded-[2.2rem] bg-white/90 p-7 shadow-soft ring-1 ring-slate-100 md:p-12">
            <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-brand-700 ring-1 ring-blue-100">
              AI Scholarship Matcher · 中文留学咨询版
            </span>
            <h1 className="mt-5 text-4xl font-black leading-[1.08] tracking-tight text-slate-950 md:text-6xl">
              2 分钟生成你的海外奖学金机会初筛报告
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
              输入你的学历、目标国家、专业、预算和语言成绩，系统先帮你判断奖学金匹配方向，再预留顾问人工复核与后续 AI 动态搜索流程。
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <AnalyticsLink href="/assessment" eventName="click_start_assessment" className="rounded-2xl bg-brand-600 px-6 py-4 text-center text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-brand-700">
                开始免费测评
              </AnalyticsLink>
              <a href="#process" className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-center text-sm font-black text-slate-800 transition hover:border-brand-200 hover:text-brand-700">
                先看匹配流程
              </a>
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-400">第一版使用 mock 数据和规则匹配，不构成最终录取或获奖承诺。</p>
          </div>

          <aside className="rounded-[2.2rem] bg-slate-950 p-6 text-white shadow-soft md:p-8">
            <p className="text-sm font-bold text-blue-200">适合正在做预算与选校判断的家庭</p>
            <div className="mt-5 grid gap-3">
              {highlights.map((item) => (
                <div key={item.label} className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/10">
                  <div className="text-3xl font-black text-white">{item.value}</div>
                  <div className="mt-1 text-sm text-slate-300">{item.label}</div>
                </div>
              ))}
            </div>
          </aside>
        </div>

        <section id="process" className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-black text-brand-600">How it works</p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">从信息收集到人工复核的 4 步流程</h2>
            </div>
          </div>
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
            <h2 className="text-xl font-black text-slate-950">它优先解决这些问题</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {painPoints.map((item) => (
                <div key={item} className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold leading-6 text-amber-950 ring-1 ring-amber-100">
                  {item}
                </div>
              ))}
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
