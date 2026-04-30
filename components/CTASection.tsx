import Link from "next/link";

export function CTASection() {
  return (
    <section className="rounded-3xl bg-slate-900 p-6 text-white shadow-soft">
      <p className="text-sm font-semibold text-blue-200">顾问人工复核</p>
      <h2 className="mt-2 text-2xl font-bold">不确定自己适合哪些奖学金？</h2>
      <p className="mt-3 text-sm leading-6 text-slate-300">
        简版报告用于快速判断方向，完整申请仍建议核验官网、截止日期、材料清单和录取策略。
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Link href="/assessment" className="rounded-2xl bg-white px-5 py-3 text-center text-sm font-bold text-slate-900">
          开始免费测评
        </Link>
        <a href="mailto:consultant@example.com" className="rounded-2xl border border-white/20 px-5 py-3 text-center text-sm font-bold text-white">
          联系顾问获取
        </a>
      </div>
    </section>
  );
}
