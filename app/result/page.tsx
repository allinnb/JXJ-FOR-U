import Link from "next/link";
import { AddWechatLink } from "@/components/AddWechatLink";
import { CTASection } from "@/components/CTASection";
import { CopyConsultationButton } from "@/components/CopyConsultationButton";
import { DownloadPdfPlaceholderButton } from "@/components/DownloadPdfPlaceholderButton";
import { PageShell } from "@/components/PageShell";
import { ResultPageClientEvents } from "@/components/ResultPageClientEvents";
import { ServiceActionButton } from "@/components/ServiceActionButton";
import { searchScholarshipsWithAI } from "@/lib/aiSearch";
import type { AssessmentFormData, ReportMeta } from "@/types";

const requiredKeys: Array<keyof AssessmentFormData> = [
  "currentEducation",
  "targetDegree",
  "targetCountries",
  "majorDirection",
  "intakeTime",
  "schoolBackground",
  "gpa",
  "languageScore",
  "experiences",
  "familyBudget",
  "scholarshipPreference",
  "acceptNonPopular",
  "needConsulting",
  "wechat",
  "email",
];

function hasUserInfo(searchParams: Record<string, string | string[] | undefined>) {
  return requiredKeys.some((key) => typeof searchParams[key] === "string" && String(searchParams[key]).trim().length > 0);
}

function getForm(searchParams: Record<string, string | string[] | undefined>): AssessmentFormData | null {
  if (!hasUserInfo(searchParams)) {
    return null;
  }

  const read = (key: keyof AssessmentFormData) => {
    const value = searchParams[key];
    return typeof value === "string" ? value : "";
  };

  return {
    currentEducation: (read("currentEducation") || "本科") as AssessmentFormData["currentEducation"],
    targetDegree: (read("targetDegree") || "硕士") as AssessmentFormData["targetDegree"],
    targetCountries: read("targetCountries"),
    majorDirection: read("majorDirection"),
    intakeTime: read("intakeTime"),
    schoolBackground: (read("schoolBackground") || "其他") as AssessmentFormData["schoolBackground"],
    gpa: read("gpa"),
    languageScore: read("languageScore"),
    experiences: read("experiences"),
    familyBudget: read("familyBudget"),
    scholarshipPreference: (read("scholarshipPreference") || "都可以") as AssessmentFormData["scholarshipPreference"],
    acceptNonPopular: (read("acceptNonPopular") || "是") as AssessmentFormData["acceptNonPopular"],
    needConsulting: (read("needConsulting") || "否") as AssessmentFormData["needConsulting"],
    wechat: read("wechat"),
    email: read("email"),
  };
}

function createReportMeta(searchParams: Record<string, string | string[] | undefined>): ReportMeta {
  const seed = [searchParams.email, searchParams.wechat, searchParams.gpa, searchParams.targetCountries]
    .map((value) => (typeof value === "string" ? value : ""))
    .join("|");
  const hash = Array.from(seed).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const randomCode = String((hash % 900000) + 100000).slice(0, 6);

  return {
    reportId: `SCH-2026-${randomCode}`,
    generatedAt: new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Shanghai",
    }).format(new Date()),
  };
}

const fullReportItems = [
  "10–20 个奖学金机会",
  "官网链接",
  "截止日期",
  "资格要求",
  "匹配评分",
  "申请难度",
  "推荐优先级",
  "材料清单",
  "申请时间线",
  "顾问建议",
];

const services = [
  {
    name: "免费简版报告",
    price: "¥0",
    tag: "当前页面",
    desc: "快速判断匹配评级、推荐方向、3 个初筛机会和关键风险。",
    points: ["整体匹配分", "3 个 mock 机会", "风险提示"],
  },
  {
    name: "完整 AI 奖学金报告",
    price: "¥99",
    tag: "适合先自助规划",
    desc: "扩展到 10–20 个机会，并整理官网链接、截止日期、资格要求、材料清单和申请优先级。",
    points: ["10–20 个机会", "官网链接与截止日期", "材料清单与优先级"],
    featured: true,
  },
  {
    name: "人工复核 + 申请策略咨询",
    price: "¥699",
    tag: "适合正式申请前",
    desc: "顾问人工核验机会真实性，规划奖学金组合、文书重点、时间线和冲刺/稳妥策略。",
    points: ["人工官网核验", "申请组合策略", "材料与时间线建议"],
  },
];

export default function ResultPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const form = getForm(searchParams);

  if (!form) {
    return (
      <PageShell>
        <section className="mx-auto max-w-2xl px-5 py-14">
          <div className="rounded-[2rem] bg-white p-7 text-center shadow-soft ring-1 ring-slate-100 md:p-10">
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700 ring-1 ring-amber-100">缺少测评信息</span>
            <h1 className="mt-5 text-3xl font-black text-slate-950">请先完成免费测评</h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">结果页需要你的学历、目标国家、GPA、预算等信息才能生成个性化奖学金匹配报告。</p>
            <Link href="/assessment" className="mt-6 inline-flex rounded-2xl bg-brand-600 px-6 py-4 text-sm font-black text-white shadow-lg shadow-blue-100">
              返回测评页
            </Link>
          </div>
        </section>
      </PageShell>
    );
  }

  const result = searchScholarshipsWithAI(form);
  const reportMeta = createReportMeta(searchParams);

  return (
    <PageShell>
      <ResultPageClientEvents reportId={reportMeta.reportId} matchLevel={result.matchLevel} overallMatchScore={result.overallMatchScore} />
      <section className="mx-auto max-w-6xl px-5 pb-14 pt-6 md:pt-10">
        <div className="mb-5 rounded-3xl bg-amber-50 px-5 py-4 text-sm font-bold leading-6 text-amber-950 ring-1 ring-amber-100">
          AI 结果仅供参考，以官网和人工复核为准。奖学金资格、金额、截止日期和材料要求可能随年度变化。
        </div>

        <div className="overflow-hidden rounded-[2.2rem] bg-slate-950 text-white shadow-soft">
          <div className="grid gap-6 p-7 md:grid-cols-[1fr_240px] md:p-10">
            <div>
              <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black text-blue-100 ring-1 ring-white/10">
                奖学金匹配报告 · 已生成
              </div>
              <h1 className="mt-5 text-3xl font-black leading-tight md:text-5xl">你的整体匹配评级：{result.matchLevel}</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                本报告基于你的测评信息、mock 奖学金库和可替换的 AI 搜索抽象层生成，适合作为奖学金方向初筛与人工复核前的决策参考。
              </p>
              <div className="mt-6 grid gap-2 text-xs font-bold text-slate-200 sm:grid-cols-2 lg:grid-cols-4">
                <span className="rounded-full bg-white/10 px-3 py-2">报告编号：{reportMeta.reportId}</span>
                <span className="rounded-full bg-white/10 px-3 py-2">生成时间：{reportMeta.generatedAt}</span>
                <span className="rounded-full bg-white/10 px-3 py-2">目标：{form.targetDegree}</span>
                <span className="rounded-full bg-white/10 px-3 py-2">偏好：{form.scholarshipPreference}</span>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <DownloadPdfPlaceholderButton />
              </div>
            </div>
            <div className="rounded-[2rem] bg-white p-6 text-center text-slate-950 shadow-lg">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">Match Score</p>
              <div className="mt-3 text-6xl font-black text-brand-700">{result.overallMatchScore}</div>
              <div className="mt-2 text-sm font-black text-slate-700">/ 100</div>
              <div className="mt-4 rounded-full bg-blue-50 px-4 py-2 text-sm font-black text-brand-700">{result.matchLevel}匹配</div>
            </div>
          </div>
          <div className="border-t border-white/10 bg-white/5 px-7 py-4 text-xs leading-5 text-slate-300 md:px-10">
            说明：第一版不承诺奖学金结果；正式申请前仍需逐项核验官网、资格条件、截止日期和材料要求。
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100 md:p-7">
            <p className="text-sm font-black text-brand-600">Student Profile</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">用户背景摘要</h2>
            <dl className="mt-5 space-y-3 text-sm">
              {[
                ["当前学历", form.currentEducation],
                ["目标学历", form.targetDegree],
                ["目标国家", form.targetCountries],
                ["专业方向", form.majorDirection],
                ["入学时间", form.intakeTime],
                ["学校背景", form.schoolBackground],
                ["GPA/均分", form.gpa],
                ["语言成绩", form.languageScore],
                ["家庭预算", form.familyBudget],
              ].map(([key, value]) => (
                <div key={key} className="flex justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3">
                  <dt className="text-slate-500">{key}</dt>
                  <dd className="text-right font-black text-slate-900">{value}</dd>
                </div>
              ))}
            </dl>
          </aside>

          <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100 md:p-7">
            <p className="text-sm font-black text-brand-600">Recommended Direction</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">推荐国家方向</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {result.recommendedCountries.map((country, index) => (
                <span key={country} className="rounded-full bg-blue-50 px-4 py-2 text-sm font-black text-brand-700 ring-1 ring-blue-100">
                  {index === 0 ? "优先方向" : "可拓展方向"} · {country}
                </span>
              ))}
            </div>
            <div className="mt-6 rounded-3xl bg-amber-50 p-5 text-sm leading-7 text-amber-950 ring-1 ring-amber-100">
              <strong>完整报告可继续扩展：</strong>包含 10–20 个机会、截止日期、官网链接、申请材料清单、优先级排序，并标注哪些项目值得人工重点复核。
            </div>
            <AddWechatLink payload={{ reportId: reportMeta.reportId }} className="mt-6 inline-flex w-full justify-center rounded-2xl bg-brand-600 px-5 py-4 text-sm font-black text-white shadow-lg shadow-blue-100 transition hover:-translate-y-0.5 hover:bg-brand-700 sm:w-auto">
              添加顾问微信，获取人工复核
            </AddWechatLink>
          </section>
        </div>

        <section className="mt-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-black text-brand-600">Mock Opportunities</p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">3 个奖学金机会初筛</h2>
            </div>
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {result.recommendedScholarships.map((item, index) => (
              <article key={item.id} className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-white">{index + 1}</span>
                  <div className="flex flex-wrap justify-end gap-2 text-xs font-black">
                    <span className="rounded-full bg-blue-50 px-3 py-1.5 text-brand-700">{item.type}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-700">{item.difficulty}</span>
                  </div>
                </div>
                <h3 className="mt-5 text-lg font-black leading-snug text-slate-950">{item.name}</h3>
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <p><strong className="text-slate-900">国家/地区：</strong>{item.country}</p>
                  <p><strong className="text-slate-900">适合学历：</strong>{item.degreeLevels.join(" / ")}</p>
                </div>
                <div className="mt-4 grid gap-2 text-xs font-bold text-slate-700">
                  <span className="rounded-2xl bg-slate-50 px-3 py-2">来源类型：{item.sourceType}</span>
                  <span className="rounded-2xl bg-slate-50 px-3 py-2">来源可靠性：{item.sourceReliability}</span>
                  <span className="rounded-2xl bg-slate-50 px-3 py-2">最近验证：{item.lastVerifiedAt}</span>
                  <span className="rounded-2xl bg-slate-50 px-3 py-2">截止日期状态：{item.deadlineStatus}</span>
                  <span className="rounded-2xl bg-slate-50 px-3 py-2">AI 置信度：{item.aiConfidence}%</span>
                  <span className="rounded-2xl bg-slate-50 px-3 py-2">人工复核：{item.needsHumanReview ? "建议" : "可选"}</span>
                </div>
                <div className="mt-4 rounded-2xl bg-green-50 p-4 text-sm leading-6 text-green-950 ring-1 ring-green-100">
                  <strong>匹配理由：</strong>{item.matchReason}
                </div>
                <div className="mt-3 rounded-2xl bg-rose-50 p-4 text-sm leading-6 text-rose-950 ring-1 ring-rose-100">
                  <strong>风险提示：</strong>{item.risk}
                </div>
                <a href={item.officialUrl} className="mt-4 inline-flex text-sm font-black text-brand-600">官网链接占位 →</a>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-4">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <p className="text-sm font-black text-rose-600">Risk Notes</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">主要风险</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
              {result.risks.map((risk, index) => <li key={risk} className="rounded-2xl bg-slate-50 px-4 py-3"><strong>风险 {index + 1}：</strong>{risk}</li>)}
            </ul>
          </div>
          <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <p className="text-sm font-black text-brand-600">Action Plan</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">下一步建议</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
              {result.nextSteps.map((step, index) => <li key={step} className="rounded-2xl bg-blue-50 px-4 py-3 text-slate-800"><strong>步骤 {index + 1}：</strong>{step}</li>)}
            </ul>
          </div>
          <CopyConsultationButton form={form} result={result} reportMeta={reportMeta} mode="summary" />
          <CopyConsultationButton form={form} result={result} reportMeta={reportMeta} />
        </section>

        <section className="mt-8 rounded-[2.2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100 md:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="text-sm font-black text-brand-600">Full Report Upgrade</p>
              <h2 className="mt-2 text-2xl font-black leading-tight text-slate-950 md:text-3xl">完整报告将包含</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                当前页面是免费初筛结果。如果你准备正式推进申请，完整报告会把机会池、官网证据、申请难度和时间线拆得更细，方便你判断哪些项目值得投入精力。
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <ServiceActionButton eventName="click_full_report" payload={{ reportId: reportMeta.reportId }}>获取 ¥99 完整 AI 报告</ServiceActionButton>
                <ServiceActionButton variant="secondary" eventName="click_human_review" payload={{ reportId: reportMeta.reportId }}>预约 ¥699 人工复核咨询</ServiceActionButton>
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-400">按钮暂不接入支付，点击后会提示添加顾问微信获取完整服务。</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
              {fullReportItems.map((item, index) => (
                <div key={item} className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100">
                  <p className="text-xs font-black text-brand-600">{String(index + 1).padStart(2, "0")}</p>
                  <p className="mt-1 text-sm font-black text-slate-900">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-5">
            <p className="text-sm font-black text-brand-600">Service Options</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">如果要继续推进，可以选择这些服务</h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {services.map((service) => (
              <div key={service.name} className={`rounded-[2rem] p-6 shadow-sm ring-1 ${service.featured ? "bg-slate-950 text-white ring-slate-800" : "bg-white text-slate-950 ring-slate-100"}`}>
                <div className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${service.featured ? "bg-white/10 text-blue-100" : "bg-blue-50 text-brand-700"}`}>{service.tag}</div>
                <p className="mt-5 text-4xl font-black">{service.price}</p>
                <h3 className="mt-3 text-xl font-black">{service.name}</h3>
                <p className={`mt-3 min-h-20 text-sm leading-6 ${service.featured ? "text-slate-300" : "text-slate-600"}`}>{service.desc}</p>
                <ul className={`mt-4 space-y-2 text-sm ${service.featured ? "text-slate-200" : "text-slate-700"}`}>
                  {service.points.map((point) => <li key={point}>✓ {point}</li>)}
                </ul>
                {service.price === "¥99" ? (
                  <ServiceActionButton eventName="click_full_report" payload={{ reportId: reportMeta.reportId, source: "service_card" }}>获取 ¥99 完整 AI 报告</ServiceActionButton>
                ) : service.price === "¥699" ? (
                  <ServiceActionButton eventName="click_human_review" payload={{ reportId: reportMeta.reportId, source: "service_card" }} variant={service.featured ? "primary" : "secondary"}>预约 ¥699 人工复核咨询</ServiceActionButton>
                ) : (
                  <AddWechatLink payload={{ reportId: reportMeta.reportId, source: "free_card" }} className={`mt-6 block rounded-2xl px-5 py-3.5 text-center text-sm font-black ${service.featured ? "bg-white text-slate-950" : "bg-slate-950 text-white"}`}>联系顾问获取</AddWechatLink>
                )}
              </div>
            ))}
          </div>
        </section>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <CTASection />
          <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100 md:p-8">
            <p className="text-sm font-black text-brand-600">Need a second opinion?</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">预约完整奖学金申请策略</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">顾问会结合你的目标国家、预算、成绩和经历，判断哪些机会值得投入申请成本，并帮你拆解材料准备节奏。</p>
            <Link href="/assessment" className="mt-6 inline-flex rounded-2xl border border-slate-200 px-5 py-3.5 text-sm font-black text-slate-800 transition hover:border-brand-200 hover:text-brand-700">重新测评</Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
