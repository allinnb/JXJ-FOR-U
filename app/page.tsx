import Image from "next/image";

import { AddWechatLink } from "@/components/AddWechatLink";
import { AnalyticsLink } from "@/components/AnalyticsLink";
import { CTASection } from "@/components/CTASection";
import { HomeVisitTracker } from "@/components/HomeVisitTracker";
import { PageShell } from "@/components/PageShell";
import { CONSULTANT_WECHAT, TRUST_DISCLAIMER } from "@/src/lib/config";

const steps = [
  { title: "填写背景", desc: "30 秒输入 GPA、国家、专业和预算等关键信息" },
  { title: "生成初筛报告", desc: "立即得到匹配等级、风险点和前 3 个机会" },
  { title: "顾问复核", desc: "进入飞书工作台，顾问核验官网和资格条件" },
  { title: "申请策略建议", desc: "判断优先级、材料清单和后续申请节奏" },
];

const audiences = ["本科申请", "硕士申请", "博士申请", "交换/访学", "预算有限", "想申请奖学金"];

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

const previewOpportunities = [
  ["英国 GREAT Scholarships", "政府/大学官网", "适合商科硕士 · 截止日期需官网核验", "82%"],
  ["Durham Business Analytics Scholarship", "大学官网", "最高 £12,000 · 申请难度中高", "78%"],
  ["院系 Merit Scholarship", "大学官网", "学费减免类 · 适合预算有限家庭", "74%"],
];

export default function HomePage() {
  return (
    <PageShell>
      <HomeVisitTracker />
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-5 md:pt-10">
        {/* Hero */}
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.62fr)_minmax(320px,0.98fr)] lg:items-stretch xl:gap-7">
          <div className="relative min-h-[520px] overflow-hidden rounded-[2.25rem] bg-white p-6 shadow-sm ring-1 ring-slate-200/70 md:p-10 lg:flex lg:items-center xl:p-12">
            <div className="absolute inset-0 soft-grid opacity-60" />
            <div className="relative max-w-[760px]">
              <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-brand-700 ring-1 ring-blue-100">
                30 秒自测 · 免费简版 · 顾问复核
              </span>
              <h1 className="mt-6 max-w-[720px] text-[2.25rem] font-black leading-[1.06] tracking-tight text-slate-950 sm:text-5xl md:text-[3.45rem] xl:text-[3.7rem]">
                测一测你的背景，适合申请哪些海外奖学金？
              </h1>
              <p className="mt-6 max-w-[650px] text-base leading-7 text-slate-600 md:text-lg">
                输入 GPA、目标国家、专业和预算，AI 为你初筛可申请的奖学金方向，并由顾问提供官网核验与申请策略建议。
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <AnalyticsLink href="/assessment" eventName="click_start_assessment" className="rounded-2xl bg-brand-600 px-7 py-4 text-center text-base font-black text-white shadow-lg shadow-blue-100 transition hover:-translate-y-0.5 hover:bg-brand-700">
                  立即生成我的奖学金报告
                </AnalyticsLink>
                <a href="#sample-report" className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-center text-sm font-black text-slate-800 transition hover:border-brand-200 hover:text-brand-700">
                  查看样例报告
                </a>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {[
                  ["仅需 30 秒", "目标国家、学历、专业、GPA"],
                  ["无需登录", "不填微信也能先看简版"],
                  ["可人工复核", "官网链接和截止日期核验"],
                ].map(([title, desc]) => (
                  <div key={title} className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100">
                    <p className="text-sm font-black text-slate-950">{title}</p>
                    <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">{desc}</p>
                  </div>
                ))}
              </div>

              <AnalyticsLink href="/assessment" eventName="click_start_assessment" className="mt-6 block rounded-2xl bg-slate-950 px-5 py-3.5 text-center text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 sm:inline-flex">
                立即开始 30 秒自测
              </AnalyticsLink>
            </div>
          </div>

          <aside id="sample-report" className="mx-auto w-full max-w-[430px] rounded-[2rem] bg-white p-4 shadow-sm ring-1 ring-slate-200/70 md:p-5 lg:mx-0 lg:self-center">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <p className="text-xs font-black text-brand-600">专业报告样例预览</p>
                <h2 className="mt-2 text-xl font-black leading-tight tracking-tight text-slate-950">英国商科硕士奖学金初筛</h2>
              </div>
              <span className="shrink-0 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-black text-green-700 ring-1 ring-green-100">A级 · 86</span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {[
                ["报告编号", "SCH-2026-SAMPLE"],
                ["机会数量", "3 / 10–20 个"],
                ["主要风险", "资格需核验"],
                ["建议方向", "英国 + 欧洲"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-100">
                  <p className="text-[10px] font-black text-slate-500">{label}</p>
                  <p className="mt-1 text-xs font-black leading-5 text-slate-900">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2.5">
              {previewOpportunities.map(([name, source, note, confidence]) => (
                <div key={name} className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-black leading-snug text-slate-950">{name}</p>
                      <p className="mt-1 text-[11px] font-semibold text-slate-500">来源：{source}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-blue-50 px-2 py-1 text-[10px] font-black text-brand-700">{confidence}</span>
                  </div>
                  <p className="mt-2 text-[11px] font-semibold leading-5 text-slate-600">{note}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-2xl bg-amber-50 p-3 ring-1 ring-amber-100">
              <p className="text-xs font-black text-amber-900">顾问核验后解锁</p>
              <p className="mt-1 text-[11px] font-semibold leading-5 text-amber-900">完整资格、官网有效性、材料清单、时间线和优先级排序。</p>
            </div>
          </aside>
        </div>

        {/* Social proof ticker */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-700 shadow-sm">
          <div className="social-marquee-track flex min-w-max gap-8">
            {[...liveActivities, ...liveActivities].map((activity, index) => (
              <span key={`${activity}-${index}`} className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {activity}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-white px-5 py-4 text-sm leading-6 text-slate-600 ring-1 ring-slate-200/70">
          <strong className="text-slate-950">156 位同学</strong>已获取奖学金初筛报告，本周已有 <strong className="text-slate-950">23 位同学</strong>复制顾问微信进行复核。
        </div>

        {/* WeChat conversion */}
        <section className="mt-10 grid gap-6 rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-200/70 md:grid-cols-[1fr_20rem] md:items-center md:p-8">
          <div>
            <p className="text-sm font-black text-brand-600">顾问人工复核入口</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 md:text-3xl">测评后，把咨询信息直接发给顾问</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">移动端可点击复制微信号，也可以长按识别二维码添加顾问；电脑端可扫码或复制微信号搜索添加。</p>
            <div className="mt-5 flex flex-wrap gap-3 text-xs font-bold text-slate-600">
              <span className="rounded-full bg-slate-50 px-3 py-2 ring-1 ring-slate-100">顾问微信：{CONSULTANT_WECHAT}</span>
              <span className="rounded-full bg-slate-50 px-3 py-2 ring-1 ring-slate-100">官网核验 · 申请策略 · 材料清单</span>
            </div>
          </div>
          <div className="rounded-3xl bg-slate-50 p-4 text-center ring-1 ring-slate-100">
            <div className="mx-auto flex h-44 w-44 items-center justify-center overflow-hidden rounded-[1.35rem] bg-white p-2 shadow-sm ring-1 ring-slate-200">
              <Image src="/consultant-wechat.jpg" alt={`顾问微信 ${CONSULTANT_WECHAT} 二维码`} width={176} height={176} className="h-full w-full rounded-2xl object-cover" />
            </div>
            <p className="mt-3 text-xs font-semibold text-slate-500">手机长按识别 / 电脑微信扫码</p>
            <AddWechatLink payload={{ source: "home_wechat_card" }} className="mt-3 inline-flex rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-black text-white">
              点击复制微信号
            </AddWechatLink>
          </div>
        </section>

        {/* Process */}
        <section id="process" className="mt-12">
          <p className="text-sm font-black text-brand-600">How it works</p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">从测评到申请策略的 4 步</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-sm font-black text-brand-700 ring-1 ring-blue-100">{index + 1}</div>
                <h3 className="mt-4 text-base font-black text-slate-950">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Audiences + Pain points */}
        <section className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200/70">
            <h2 className="text-xl font-black text-slate-950">适合人群</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {audiences.map((item) => (
                <span key={item} className="rounded-full bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700 ring-1 ring-slate-100">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200/70">
            <h2 className="text-xl font-black text-slate-950">为什么建议先测一测？</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {["官网信息分散，截止日期容易遗漏", "不同奖学金覆盖范围差异很大", "GPA 和语言要求需要逐项核验", "顾问可帮助判断申请投入是否值得"].map((item) => (
                <div key={item} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold leading-6 text-slate-700 ring-1 ring-slate-100">
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
              <div key={item.name} className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-sm font-black text-white">{item.name[0]}</div>
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

        {/* Service expansion */}
        <section className="mt-10">
          <p className="text-sm font-black text-brand-600">Our Services</p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">不只是奖学金，我们覆盖你的全程规划</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {[
              ["升学规划", "从选校定位、文书指导到申请材料复核，帮你构建有竞争力的申请组合。", "获取我的专属升学方案", "/assessment"],
              ["奖学金申请", "AI 初筛 + 顾问人工复核，帮你找到 10–20 个值得申请的奖学金机会。", "获取我的专属奖学金方案", "/assessment"],
              ["签证服务", "已拿到 offer？我们提供签证材料准备、面签辅导和入境指导一站式服务。", "获取我的专属签证方案", "wechat"],
            ].map(([title, desc, cta, href]) => (
              <div key={title} className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200/70">
                <h3 className="text-lg font-black text-slate-950">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{desc}</p>
                {href === "wechat" ? (
                  <AddWechatLink payload={{ source: "home_visa" }} className="mt-5 inline-flex text-sm font-black text-brand-600">{cta} →</AddWechatLink>
                ) : (
                  <AnalyticsLink href={href} eventName="click_start_assessment" className="mt-5 inline-flex text-sm font-black text-brand-600">{cta} →</AnalyticsLink>
                )}
              </div>
            ))}
          </div>
        </section>

        <p className="mt-8 rounded-2xl bg-amber-50 px-5 py-4 text-xs font-bold leading-5 text-amber-900 ring-1 ring-amber-100">{TRUST_DISCLAIMER}</p>

        <div className="mt-10">
          <CTASection />
        </div>
      </section>
    </PageShell>
  );
}
