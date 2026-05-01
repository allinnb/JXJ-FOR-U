import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { CONSULTANT_WECHAT, PRODUCT_NAME, TRUST_DISCLAIMER } from "@/src/lib/config";
import { getFullReportData } from "@/src/lib/feishu/reports";
import type { FullReportData, FullReportScholarship } from "@/src/lib/feishu/reports";

export const dynamic = "force-dynamic";

type PageProps = {
  params: { reportId: string };
};

function splitLines(value: string) {
  return value.split(/\n|；|;/).map((item) => item.trim()).filter(Boolean);
}

function priorityLabel(value: string) {
  if (value === "high") return "高优先级";
  if (value === "low") return "低优先级";
  return "中优先级";
}

function decisionLabel(value: string) {
  if (value === "keep") return "建议保留";
  if (value === "remove") return "不建议推荐";
  return "待顾问确认";
}

function buildStrategy(data: FullReportData) {
  const top = data.scholarships[0];
  if (!top) return "当前报告暂无可展示的奖学金机会，请联系顾问补充复核。";
  const country = data.lead.targetCountry || top.country || "目标国家";
  const major = data.lead.targetMajor || "目标专业";
  const highCount = data.stats.highPriorityCount;
  return `建议优先围绕 ${country} 的 ${major} 方向筛选机会。当前完整报告中有 ${data.stats.scholarshipCount} 个候选机会，其中 ${highCount} 个为高优先级。建议先核验高优先级项目的资格要求和截止日期，再准备材料清单与申请时间线。`;
}

function ErrorState({ title, description }: { title: string; description: string }) {
  return (
    <PageShell>
      <section className="mx-auto max-w-2xl px-5 py-16">
        <div className="rounded-[2rem] bg-white p-8 text-center shadow-soft ring-1 ring-slate-100">
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700 ring-1 ring-amber-100">完整报告</span>
          <h1 className="mt-5 text-3xl font-black text-slate-950">{title}</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
          <p className="mt-3 text-xs leading-6 text-slate-500">如果客户已付款但链接无法打开，请先确认顾问已在飞书完成 AI 复核和报告生成。</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/assessment" className="rounded-2xl bg-brand-600 px-6 py-4 text-sm font-black text-white">重新测评</Link>
            <span className="rounded-2xl bg-slate-100 px-6 py-4 text-sm font-black text-slate-700">顾问微信：{CONSULTANT_WECHAT}</span>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function ScholarshipRow({ item, index }: { item: FullReportScholarship; index: number }) {
  const priorityClass = item.advisorPriority === "high" ? "bg-green-50 text-green-700 ring-green-100" : item.advisorPriority === "low" ? "bg-slate-50 text-slate-600 ring-slate-100" : "bg-blue-50 text-brand-700 ring-blue-100";

  return (
    <article className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Opportunity {String(index + 1).padStart(2, "0")}</p>
          <h3 className="mt-2 text-xl font-black leading-snug text-slate-950">{item.name || "待确认奖学金机会"}</h3>
          <p className="mt-1 text-sm text-slate-600">{item.institution || "待确认机构"} · {item.country || "待确认国家"}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${priorityClass}`}>{priorityLabel(item.advisorPriority)}</span>
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700 ring-1 ring-amber-100">{decisionLabel(item.advisorDecision)}</span>
        </div>
      </div>

      <div className="mt-5 grid gap-3 text-sm md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-slate-50 px-4 py-3"><strong>适合学历：</strong>{item.degreeLevel || "待确认"}</div>
        <div className="rounded-2xl bg-slate-50 px-4 py-3"><strong>奖学金类型：</strong>{item.scholarshipType || "待确认"}</div>
        <div className="rounded-2xl bg-slate-50 px-4 py-3"><strong>金额：</strong>{item.amount || "待确认"}</div>
        <div className="rounded-2xl bg-slate-50 px-4 py-3"><strong>截止日期：</strong>{item.deadline || "待确认"}</div>
        <div className="rounded-2xl bg-slate-50 px-4 py-3"><strong>来源：</strong>{item.sourceType || "待确认"}</div>
        <div className="rounded-2xl bg-slate-50 px-4 py-3"><strong>可靠性：</strong>{item.sourceReliability || "待确认"}</div>
        <div className="rounded-2xl bg-slate-50 px-4 py-3"><strong>AI 置信度：</strong>{item.aiConfidence || 0}%</div>
        <div className="rounded-2xl bg-slate-50 px-4 py-3"><strong>人工复核：</strong>{item.requiresHumanReview || "建议"}</div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl bg-green-50 p-4 text-sm leading-6 text-green-950 ring-1 ring-green-100"><strong>匹配理由：</strong>{item.matchReason || "待顾问补充。"}</div>
        <div className="rounded-2xl bg-rose-50 p-4 text-sm leading-6 text-rose-950 ring-1 ring-rose-100"><strong>风险提示：</strong>{item.risks || "资格、金额和截止日期需以官网为准。"}</div>
      </div>

      {item.advisorNote ? <div className="mt-3 rounded-2xl bg-blue-50 p-4 text-sm leading-6 text-slate-800 ring-1 ring-blue-100"><strong>顾问备注：</strong>{item.advisorNote}</div> : null}

      {item.officialUrl ? <a href={item.officialUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white">查看官网链接 →</a> : null}
    </article>
  );
}

export default async function FullReportPage({ params }: PageProps) {
  let data: FullReportData | null = null;
  let error = "";

  try {
    data = await getFullReportData(decodeURIComponent(params.reportId));
  } catch (err) {
    console.error("[report] failed to load full report", err);
    error = err instanceof Error && err.message.includes("缺少服务端环境变量") ? err.message : "完整报告暂时无法读取，请稍后重试或联系顾问。";
  }

  if (error) return <ErrorState title="完整报告暂时无法读取" description={`${error} 顾问微信：${CONSULTANT_WECHAT}`} />;
  if (!data) return <ErrorState title="未找到该报告" description="请确认报告编号是否正确，或联系顾问核对完整报告链接。" />;

  const riskItems = splitLines(data.lead.risks);
  const nextSteps = splitLines(data.lead.nextSteps);
  const materialItems = ["中英文成绩单", "语言成绩单", "个人简历 CV", "个人陈述 / Research Proposal", "推荐信", "护照与身份材料", "资金证明或预算说明", "获奖、论文、实习证明材料"];
  const timelineItems = ["立即核验高优先级项目官网资格和截止日期", "1 周内确定申请清单和优先级", "2 周内准备核心申请材料", "截止日期前完成提交并保留回执", "提交后追踪邮件和补件要求"];

  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-5 pb-14 pt-6 md:pt-10">
        <div className="mb-5 rounded-3xl bg-amber-50 px-5 py-4 text-sm font-bold leading-6 text-amber-950 ring-1 ring-amber-100">{TRUST_DISCLAIMER} 本页面为付费完整报告交付链接，由顾问复核飞书数据后发送，请勿公开传播。</div>

        <div className="overflow-hidden rounded-[2.2rem] bg-slate-950 text-white shadow-soft">
          <div className="grid gap-6 p-7 md:grid-cols-[1fr_260px] md:p-10">
            <div>
              <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black text-blue-100 ring-1 ring-white/10">Paid Full Report · {PRODUCT_NAME}</span>
              <h1 className="mt-5 text-3xl font-black leading-tight md:text-5xl">完整 AI 奖学金报告</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">报告编号：{data.reportId}。本报告基于 AI 搜索候选、飞书记录和顾问复核字段生成，用于付费客户的完整机会清单交付；正式申请前仍需以官网最终信息为准。</p>
              <div className="mt-6 grid gap-2 text-xs font-bold text-slate-200 sm:grid-cols-2 lg:grid-cols-4">
                <span className="rounded-full bg-white/10 px-3 py-2">生成时间：{new Date().toLocaleString("zh-CN", { hour12: false })}</span>
                <span className="rounded-full bg-white/10 px-3 py-2">匹配等级：{data.lead.matchLevel || "待确认"}</span>
                <span className="rounded-full bg-white/10 px-3 py-2">匹配分数：{data.lead.matchScore || "待确认"}</span>
                <span className="rounded-full bg-white/10 px-3 py-2">机会数量：{data.stats.scholarshipCount}</span>
              </div>
            </div>
            <div className="rounded-[2rem] bg-white p-6 text-center text-slate-950 shadow-lg">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">Full Report</p>
              <div className="mt-3 text-6xl font-black text-brand-700">{data.stats.scholarshipCount}</div>
              <div className="mt-2 text-sm font-black text-slate-700">个候选机会</div>
              <div className="mt-4 rounded-full bg-green-50 px-4 py-2 text-sm font-black text-green-700">高优先级 {data.stats.highPriorityCount} 个</div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100 md:p-7">
            <p className="text-sm font-black text-brand-600">Student Profile</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">客户背景摘要</h2>
            <dl className="mt-5 space-y-3 text-sm">
              {[
                ["当前学历", data.lead.currentEducation],
                ["目标学历", data.lead.targetDegree],
                ["目标国家", data.lead.targetCountry],
                ["专业方向", data.lead.targetMajor],
                ["入学时间", data.lead.intakeTime],
                ["学校背景", data.lead.schoolBackground],
                ["GPA/均分", data.lead.gpa],
                ["语言成绩", data.lead.languageScore],
                ["家庭预算", data.lead.budget],
                ["奖学金偏好", data.lead.scholarshipPreference],
              ].map(([key, value]) => (
                <div key={key} className="flex justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3"><dt className="text-slate-500">{key}</dt><dd className="text-right font-black text-slate-900">{value || "待确认"}</dd></div>
              ))}
            </dl>
          </aside>

          <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100 md:p-7">
            <p className="text-sm font-black text-brand-600">Advisor Strategy</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">申请策略摘要</h2>
            <p className="mt-4 rounded-3xl bg-blue-50 p-5 text-sm leading-7 text-slate-800 ring-1 ring-blue-100">{buildStrategy(data)}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-4"><p className="text-2xl font-black text-slate-950">{data.stats.scholarshipCount}</p><p className="text-xs text-slate-500">候选机会</p></div>
              <div className="rounded-2xl bg-green-50 p-4"><p className="text-2xl font-black text-green-700">{data.stats.highPriorityCount}</p><p className="text-xs text-green-700">高优先级</p></div>
              <div className="rounded-2xl bg-amber-50 p-4"><p className="text-2xl font-black text-amber-700">{data.stats.humanReviewCount}</p><p className="text-xs text-amber-700">需重点核验</p></div>
            </div>
            {data.lead.consultantNotes ? <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700"><strong>顾问总备注：</strong>{data.lead.consultantNotes}</div> : null}
          </section>
        </div>

        <section className="mt-8">
          <p className="text-sm font-black text-brand-600">Scholarship Opportunities</p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">完整奖学金机会清单</h2>
          <div className="mt-5 space-y-4">
            {data.scholarships.length > 0 ? data.scholarships.map((item, index) => <ScholarshipRow key={`${item.name}-${index}`} item={item} index={index} />) : <div className="rounded-[2rem] bg-white p-8 text-center text-sm text-slate-600 ring-1 ring-slate-100">该报告暂未生成可展示的奖学金机会，请联系顾问补充复核。</div>}
          </div>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-3">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h2 className="text-xl font-black text-slate-950">主要风险</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">{(riskItems.length ? riskItems : ["金额、资格要求和截止日期需以官网为准。", "部分机会可能需要额外文书或院系提名。自费预算仍需预留。"]).map((risk, index) => <li key={risk} className="rounded-2xl bg-rose-50 px-4 py-3 text-rose-950"><strong>风险 {index + 1}：</strong>{risk}</li>)}</ul>
          </div>
          <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h2 className="text-xl font-black text-slate-950">建议材料清单</h2>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">{materialItems.map((item) => <li key={item}>✓ {item}</li>)}</ul>
          </div>
          <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h2 className="text-xl font-black text-slate-950">申请时间线</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">{(nextSteps.length ? nextSteps : timelineItems).map((item, index) => <li key={item} className="rounded-2xl bg-blue-50 px-4 py-3"><strong>{index + 1}.</strong> {item}</li>)}</ul>
          </div>
        </section>

        <section className="mt-8 rounded-[2.2rem] bg-slate-950 p-7 text-center text-white shadow-soft md:p-10">
          <p className="text-sm font-black text-blue-100">Next Step</p>
          <h2 className="mt-2 text-3xl font-black">需要顾问继续拆解申请策略？</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-300">建议将本报告中的高优先级机会与顾问逐项核验，确认官网要求、材料难度和申请截止日期后，再决定最终申请组合。</p>
          <div className="mt-6 inline-flex rounded-2xl bg-white px-6 py-4 text-sm font-black text-slate-950">顾问微信：{CONSULTANT_WECHAT}</div>
        </section>
      </section>
    </PageShell>
  );
}
