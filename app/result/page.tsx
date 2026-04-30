import Link from "next/link";
import { CTASection } from "@/components/CTASection";
import { PageShell } from "@/components/PageShell";
import { matchScholarships } from "@/lib/matcher";
import type { AssessmentFormData } from "@/types";

const fallback: AssessmentFormData = {
  currentEducation: "本科",
  targetDegree: "硕士",
  targetCountries: "英国/欧洲",
  majorDirection: "商科",
  intakeTime: "2026 Fall",
  schoolBackground: "211",
  gpa: "86/100",
  languageScore: "雅思 7.0",
  experiences: "有实习经历和校内项目经历，希望申请奖学金。",
  familyBudget: "预算有限",
  scholarshipPreference: "都可以",
  acceptNonPopular: "是",
  needConsulting: "是",
  wechat: "",
  email: "",
};

function getForm(searchParams: Record<string, string | string[] | undefined>): AssessmentFormData {
  const read = (key: keyof AssessmentFormData) => {
    const value = searchParams[key];
    return typeof value === "string" && value.length > 0 ? value : fallback[key];
  };

  return {
    currentEducation: read("currentEducation") as AssessmentFormData["currentEducation"],
    targetDegree: read("targetDegree") as AssessmentFormData["targetDegree"],
    targetCountries: read("targetCountries"),
    majorDirection: read("majorDirection"),
    intakeTime: read("intakeTime"),
    schoolBackground: read("schoolBackground") as AssessmentFormData["schoolBackground"],
    gpa: read("gpa"),
    languageScore: read("languageScore"),
    experiences: read("experiences"),
    familyBudget: read("familyBudget"),
    scholarshipPreference: read("scholarshipPreference") as AssessmentFormData["scholarshipPreference"],
    acceptNonPopular: read("acceptNonPopular") as AssessmentFormData["acceptNonPopular"],
    needConsulting: read("needConsulting") as AssessmentFormData["needConsulting"],
    wechat: read("wechat"),
    email: read("email"),
  };
}

const services = [
  { name: "免费简版报告", price: "¥0", desc: "查看初步匹配评级、3 个方向机会和关键风险。" },
  { name: "完整 AI 奖学金报告", price: "¥99", desc: "包含 10–20 个机会、截止日期、官网链接、材料清单和优先级排序。" },
  { name: "人工复核 + 申请策略咨询", price: "¥699", desc: "顾问人工核验匹配度，规划申请节奏、文书重点和冲刺/稳妥组合。" },
];

export default function ResultPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const form = getForm(searchParams);
  const result = matchScholarships(form);

  return (
    <PageShell>
      <section className="mx-auto max-w-5xl px-5 pb-12 pt-6">
        <div className="rounded-[2rem] bg-white p-6 shadow-soft md:p-10">
          <p className="text-sm font-semibold text-brand-600">奖学金匹配报告</p>
          <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-black text-slate-950">你的整体匹配评级：{result.matchLevel}</h1>
              <p className="mt-3 text-sm leading-6 text-slate-600">综合匹配分：{result.overallMatchScore}/100。该结果基于本地 mock 数据和规则模型生成，适合作为初步方向筛选。</p>
            </div>
            <div className="rounded-3xl bg-blue-50 p-5 text-center">
              <div className="text-4xl font-black text-brand-700">{result.overallMatchScore}</div>
              <div className="text-xs font-semibold text-slate-500">MATCH SCORE</div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-[1fr_1.4fr]">
          <aside className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h2 className="text-lg font-black text-slate-950">用户背景摘要</h2>
            <dl className="mt-4 space-y-3 text-sm">
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
                <div key={key} className="flex justify-between gap-3 border-b border-slate-100 pb-2">
                  <dt className="text-slate-500">{key}</dt>
                  <dd className="text-right font-semibold text-slate-800">{value}</dd>
                </div>
              ))}
            </dl>
          </aside>

          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h2 className="text-lg font-black text-slate-950">推荐国家方向</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {result.recommendedCountries.map((country) => (
                <span key={country} className="rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-brand-700">{country}</span>
              ))}
            </div>
            <div className="mt-6 rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">
              完整报告包含 10–20 个机会、截止日期、官网链接、申请材料清单、优先级排序。
            </div>
          </section>
        </div>

        <section className="mt-6">
          <h2 className="text-xl font-black text-slate-950">3 个 mock 奖学金推荐</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {result.recommendedScholarships.map((item) => (
              <article key={item.id} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                <h3 className="text-lg font-black text-slate-950">{item.name}</h3>
                <div className="mt-3 space-y-2 text-sm text-slate-600">
                  <p><strong>国家/地区：</strong>{item.country}</p>
                  <p><strong>适合学历：</strong>{item.degreeLevels.join(" / ")}</p>
                  <p><strong>奖学金类型：</strong>{item.type}</p>
                  <p><strong>申请难度：</strong>{item.difficulty}</p>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-700"><strong>匹配理由：</strong>{item.matchReason}</p>
                <p className="mt-3 text-sm leading-6 text-rose-700"><strong>风险提示：</strong>{item.risk}</p>
                <a href={item.officialUrl} className="mt-4 inline-flex text-sm font-bold text-brand-600">官网链接占位 →</a>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h2 className="text-lg font-black text-slate-950">主要风险</h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
              {result.risks.map((risk) => <li key={risk}>• {risk}</li>)}
            </ul>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h2 className="text-lg font-black text-slate-950">下一步建议</h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
              {result.nextSteps.map((step) => <li key={step}>• {step}</li>)}
            </ul>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          {services.map((service) => (
            <div key={service.name} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <p className="text-3xl font-black text-slate-950">{service.price}</p>
              <h3 className="mt-3 text-lg font-black text-slate-900">{service.name}</h3>
              <p className="mt-3 min-h-20 text-sm leading-6 text-slate-600">{service.desc}</p>
              <a href="mailto:consultant@example.com" className="mt-5 block rounded-2xl bg-slate-900 px-5 py-3 text-center text-sm font-bold text-white">联系顾问获取</a>
            </div>
          ))}
        </section>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <CTASection />
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h2 className="text-xl font-black text-slate-950">预约完整奖学金申请策略</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">添加顾问微信，获取人工复核。顾问会结合你的目标国家、预算、成绩和经历，判断哪些机会值得投入申请成本。</p>
            <Link href="/assessment" className="mt-5 inline-flex rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-800">重新测评</Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
