import Image from "next/image";

import { AddWechatLink } from "@/components/AddWechatLink";
import { AnalyticsLink } from "@/components/AnalyticsLink";
import { CTASection } from "@/components/CTASection";
import { HomeVisitTracker } from "@/components/HomeVisitTracker";
import { PageShell } from "@/components/PageShell";
import { CONSULTANT_WECHAT, TRUST_DISCLAIMER } from "@/src/lib/config";

const steps = [
  { title: "填写背景", desc: "30 秒输入 GPA、国家、专业和预算等关键信息" },
  { title: "生成初筛报告", desc: "系统先用规则模型判断匹配等级和风险点" },
  { title: "顾问复核", desc: "同步到飞书工作台，顾问核验官网和资格条件" },
  { title: "申请策略建议", desc: "判断优先级、材料清单和后续申请节奏" },
];

const audiences = ["本科申请", "硕士申请", "博士申请", "交换/访学", "预算有限", "想申请奖学金"];

const sampleReport = [
  { label: "高匹配机会", value: "英国 GREAT、学院 Merit Scholarship、欧洲政府类专项", tone: "bg-green-50 text-green-800 ring-green-100" },
  { label: "中匹配机会", value: "学费减免、院系奖、非热门地区专项资助", tone: "bg-blue-50 text-brand-700 ring-blue-100" },
  { label: "主要风险", value: "截止日期、GPA 换算、语言小分、覆盖范围需官网核验", tone: "bg-amber-50 text-amber-900 ring-amber-100" },
  { label: "建议方向", value: "先扩展 10–20 个机会池，再由顾问筛出优先组合", tone: "bg-slate-100 text-slate-800 ring-slate-200" },
];

const reportPreviewFields = ["官网链接", "截止日期", "资格要求", "AI 置信度", "申请难度", "推荐优先级"];

const liveActivities = [
  "3 分钟前，杭州李同学获得英国 GREAT 奖学金匹配方案",
  "8 分钟前，宁波张同学生成欧洲硕士奖学金初筛报告",
  "12 分钟前，上海王同学发现 4 个商科半奖机会",
  "18 分钟前，温州陈同学复制顾问微信进行人工复核",
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
      <section className="mx-auto max-w-6xl px-4 pb-14 pt-5 sm:px-5 md:pt-8">
        {/* Hero */}
        <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
          <div className="rounded-[1.8rem] bg-white/95 p-5 shadow-soft ring-1 ring-slate-100 sm:p-7 md:p-9">
            <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-brand-700 ring-1 ring-blue-100">
              30 秒自测 · 官网核验 · 顾问复核
            </span>
            <h1 className="mt-4 max-w-3xl text-[2.35rem] font-black leading-[1.08] tracking-tight text-slate-950 sm:text-5xl md:text-[3.35rem]">
              测一测你的背景，适合申请哪些海外奖学金？
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
              输入 GPA、目标国家、专业和预算，AI 为你初筛可申请的奖学金方向，并由顾问提供官网核验与申请策略建议。
            </p>

            <div className="mt-5 grid gap-2 rounded-3xl bg-slate-50 p-3 ring-1 ring-slate-100 sm:grid-cols-3">
              {[
                ["仅需 30 秒", "先填 4 个关键信息"],
                ["免费出简版", "立即看到前 3 个机会"],
                ["顾问可复核", "官网链接与截止日期核验"],
              ].map(([title, desc]) => (
                <div key={title} className="rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-100">
                  <p className="text-sm font-black text-slate-950">{title}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">{desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <AnalyticsLink href="/assessment" eventName="click_start_assessment" className="rounded-2xl bg-brand-600 px-7 py-4 text-center text-base font-black text-white shadow-xl shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-brand-700">
                立即生成我的奖学金报告
              </AnalyticsLink>
              <a href="#sample-report" className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-center text-sm font-black text-slate-800 transition hover:border-brand-200 hover:text-brand-700">
                查看样例报告
              </a>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl bg-slate-950 px-4 py-3 text-xs font-bold text-white ring-1 ring-slate-800">
              <div className="social-marquee-track flex min-w-max gap-8">
                {[...liveActivities, ...liveActivities].map((activity, index) => (
                  <span key={`${activity}-${index}`} className="inline-flex items-center gap-2 text-blue-100">
                    <span className="h-2 w-2 rounded-full bg-green-400" />
                    {activity}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3 text-sm text-slate-600">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-xs font-black text-green-700">✓</span>
              <span><strong className="text-slate-900">156 位同学</strong>已获取奖学金初筛报告，本周已有 23 位同学复制顾问微信进行复核</span>
            </div>

            <div className="mt-4 grid gap-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <p className="text-sm font-black text-slate-950">顾问微信：{CONSULTANT_WECHAT}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">5 年留学咨询经验 · 已帮助 200+ 位学生梳理升学/奖学金/签证方案。</p>
              </div>
              <AddWechatLink payload={{ source: "home_hero" }} className="rounded-xl bg-slate-950 px-4 py-3 text-xs font-black text-white">
                点击复制微信号
              </AddWechatLink>
            </div>
            <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-xs font-bold leading-5 text-amber-900 ring-1 ring-amber-100">{TRUST_DISCLAIMER}</p>
          </div>

          <aside id="sample-report" className="rounded-[1.8rem] bg-slate-950 p-5 text-white shadow-soft md:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-blue-200">专业报告样例预览</p>
                <h2 className="mt-2 text-xl font-black md:text-2xl">填表前先看报告是否有用</h2>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-950">Demo</span>
            </div>

            <div className="mt-4 rounded-[1.5rem] bg-white p-4 text-slate-950 shadow-2xl">
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <p className="text-xs font-black text-brand-600">SCH-2026-SAMPLE</p>
                  <p className="mt-1 text-lg font-black">英国商科硕士奖学金初筛</p>
                </div>
                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-black text-green-700">高匹配</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {reportPreviewFields.map((field) => (
                  <div key={field} className="rounded-2xl bg-slate-50 px-3 py-2 ring-1 ring-slate-100">
                    <p className="text-[11px] font-black text-slate-500">{field}</p>
                    <div className="mt-2 h-1.5 rounded-full bg-slate-200" />
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-2xl bg-blue-50 p-3 ring-1 ring-blue-100">
                <p className="text-xs font-black text-brand-700">样例结论</p>
                <p className="mt-1 text-sm font-bold leading-6 text-slate-700">建议优先核验 3 个高价值机会，并扩展 10–20 个完整机会池。</p>
              </div>
            </div>

            <div className="mt-4 grid gap-2">
              {sampleReport.map((item) => (
                <div key={item.label} className={`rounded-2xl p-3 ring-1 ${item.tone}`}>
                  <p className="text-xs font-black">{item.label}</p>
                  <p className="mt-1 text-sm font-bold leading-5">{item.value}</p>
                </div>
              ))}
            </div>
            <AnalyticsLink href="/assessment" eventName="click_start_assessment" className="mt-6 block rounded-2xl bg-white px-5 py-4 text-center text-sm font-black text-slate-950 transition hover:-translate-y-0.5">
              立即生成我的报告
            </AnalyticsLink>
          </aside>
        </div>

        {/* WeChat conversion */}
        <section className="mt-8 grid gap-5 rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-100 md:grid-cols-[1fr_19rem] md:items-center md:p-7">
          <div>
            <p className="text-sm font-black text-brand-600">顾问人工复核入口</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">测评后可直接把咨询信息发给顾问</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">移动端可点击复制微信号，也可以长按识别二维码添加顾问；电脑端可扫码或复制微信号搜索添加。</p>
          </div>
          <div className="w-full rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-100 sm:flex sm:items-center sm:gap-4 md:justify-self-end">
            <div className="mx-auto flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white p-1.5 shadow-sm ring-1 ring-slate-200 sm:mx-0">
              <Image
                src="/consultant-wechat.jpg"
                alt={`顾问微信 ${CONSULTANT_WECHAT} 二维码`}
                width={128}
                height={128}
                className="h-full w-full rounded-xl object-cover"
                priority
              />
            </div>
            <div className="mt-4 text-center sm:mt-0 sm:text-left">
              <p className="text-xs font-bold text-slate-500">顾问微信</p>
              <p className="mt-1 text-lg font-black text-slate-950">{CONSULTANT_WECHAT}</p>
              <p className="mt-1 text-xs font-semibold text-slate-500">长按二维码识别 / 扫码添加</p>
              <AddWechatLink payload={{ source: "home_wechat_card" }} className="mt-3 inline-flex rounded-xl bg-brand-600 px-4 py-2 text-xs font-black text-white">
                点击复制微信号
              </AddWechatLink>
            </div>
          </div>
        </section>

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
