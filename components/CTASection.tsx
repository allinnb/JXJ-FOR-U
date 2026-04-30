import Link from "next/link";

export function CTASection() {
  return (
    <section className="overflow-hidden rounded-[2rem] bg-slate-950 p-6 text-white shadow-soft ring-1 ring-slate-800 md:p-8">
      <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-blue-100 w-fit">顾问人工复核</div>
      <h2 className="mt-4 text-2xl font-black leading-tight md:text-3xl">把 AI 初筛结果，变成可执行的申请清单</h2>
      <p className="mt-3 text-sm leading-6 text-slate-300">
        简版报告先判断方向；完整申请前，建议进一步核验官网链接、截止日期、资格条件、材料清单和申请优先级。
      </p>
      <div className="mt-5 grid gap-2 text-sm text-slate-200 sm:grid-cols-2">
        {['官网来源核验', '截止日期排查', '材料清单整理', '申请策略建议'].map((item) => (
          <div key={item} className="rounded-2xl bg-white/8 px-4 py-3 ring-1 ring-white/10">✓ {item}</div>
        ))}
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link href="/assessment" className="rounded-2xl bg-white px-5 py-3.5 text-center text-sm font-black text-slate-950 shadow-lg transition hover:-translate-y-0.5">
          重新免费测评
        </Link>
        <a href="mailto:consultant@example.com" className="rounded-2xl border border-white/25 px-5 py-3.5 text-center text-sm font-black text-white transition hover:bg-white/10">
          添加顾问微信，获取人工复核
        </a>
      </div>
    </section>
  );
}
