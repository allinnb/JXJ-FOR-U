import Link from "next/link";
import { CTASection } from "@/components/CTASection";
import { PageShell } from "@/components/PageShell";

const steps = ["填写背景", "AI 匹配", "获取报告", "人工复核/申请辅导"];
const audiences = ["本科申请", "硕士申请", "博士申请", "预算有限", "想申请奖学金的学生"];

export default function HomePage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-5xl px-5 pb-12 pt-8">
        <div className="rounded-[2rem] bg-white p-7 shadow-soft md:p-12">
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-brand-700">
            留学规划 × 奖学金机会初筛
          </span>
          <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight text-slate-950 md:text-6xl">
            AI 留学奖学金匹配助手
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
            输入你的背景，AI 帮你动态搜索并推荐适合申请的海外奖学金机会。第一版使用本地规则和 mock 数据，后续可无缝接入 AI 搜索与顾问复核流程。
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/assessment" className="rounded-2xl bg-brand-600 px-6 py-4 text-center text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-brand-700">
              开始免费测评
            </Link>
            <a href="#process" className="rounded-2xl border border-slate-200 px-6 py-4 text-center text-sm font-bold text-slate-700">
              查看匹配流程
            </a>
          </div>
        </div>

        <section id="process" className="mt-10">
          <h2 className="text-xl font-bold text-slate-950">4 步获取奖学金方向</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-sm font-black text-brand-600">{index + 1}</div>
                <p className="mt-4 text-sm font-bold text-slate-900">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <h2 className="text-xl font-bold text-slate-950">适合人群</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {audiences.map((item) => (
              <span key={item} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                {item}
              </span>
            ))}
          </div>
        </section>

        <div className="mt-10">
          <CTASection />
        </div>
      </section>
    </PageShell>
  );
}
