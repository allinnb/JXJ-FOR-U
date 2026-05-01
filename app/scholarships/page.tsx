import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { mockScholarships } from "@/src/lib/mockScholarships";
import { sourceTypeLabels, sourceReliabilityLabels } from "@/src/types";

export const metadata: Metadata = {
  title: "海外奖学金数据库 | AI 留学奖学金匹配助手",
  description: "浏览已收录的海外奖学金机会，覆盖英国、欧洲、澳洲、北美等方向。AI 初筛 + 顾问复核，帮你找到适合申请的奖学金。",
};

export default function ScholarshipsPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-5 pb-14 pt-8 md:pt-12">
        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-brand-700 ring-1 ring-blue-100">
          Scholarship Database
        </span>
        <h1 className="mt-4 text-3xl font-black leading-tight text-slate-950 md:text-5xl">海外奖学金数据库</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
          已收录 {mockScholarships.length} 个经过初步筛选的奖学金机会，覆盖政府奖学金、大学奖学金、国际组织资助等方向。数据持续更新中。
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {mockScholarships.map((item) => (
            <article key={item.id} className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black text-brand-700">{item.scholarshipType}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">{item.country}</span>
              </div>
              <h2 className="mt-4 text-xl font-black leading-snug text-slate-950">{item.name}</h2>
              <p className="mt-2 text-sm text-slate-600">{item.institution}</p>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p><strong className="text-slate-900">适合学历：</strong>{Array.isArray(item.degreeLevel) ? item.degreeLevel.join(" / ") : item.degreeLevel}</p>
                <p><strong className="text-slate-900">金额：</strong>{item.amount}</p>
                <p><strong className="text-slate-900">截止日期：</strong>{item.deadline}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700 ring-1 ring-slate-200">来源：{sourceTypeLabels[item.sourceType]}</span>
                <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700 ring-1 ring-slate-200">可靠性：{sourceReliabilityLabels[item.sourceReliability]}</span>
                <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700 ring-1 ring-slate-200">AI 置信度：{item.aiConfidence}%</span>
              </div>
              <div className="mt-4 rounded-2xl bg-green-50 p-3 text-sm leading-6 text-green-950 ring-1 ring-green-100">
                <strong>匹配建议：</strong>{item.matchReason}
              </div>
              <a href={item.officialUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex text-sm font-black text-brand-600">查看官网 →</a>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-[2rem] bg-slate-950 p-6 text-center text-white md:p-8">
          <h2 className="text-2xl font-black">想看到更多奖学金机会？</h2>
          <p className="mt-3 text-sm text-slate-300">完成免费测评，AI 会根据你的背景筛选 10–20 个最适合的奖学金方向。</p>
          <Link href="/assessment" className="mt-6 inline-flex rounded-2xl bg-white px-6 py-4 text-sm font-black text-slate-950 transition hover:-translate-y-0.5">
            开始免费测评
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
