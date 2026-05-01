import Link from "next/link";
import { CONSULTANT_WECHAT } from "@/src/lib/config";
import { AddWechatLink } from "@/components/AddWechatLink";

export function CTASection() {
  return (
    <section className="overflow-hidden rounded-[1.75rem] bg-slate-950 p-6 text-white shadow-sm ring-1 ring-slate-800 md:p-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <div className="w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-blue-100 ring-1 ring-white/10">顾问人工复核</div>
          <h2 className="mt-4 max-w-2xl text-2xl font-black leading-tight md:text-3xl">把 AI 初筛结果，变成可执行的申请清单</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
            简版报告先判断方向；完整申请前，建议进一步核验官网链接、截止日期、资格条件、材料清单和申请优先级。
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-slate-200">
            {['官网来源核验', '截止日期排查', '材料清单整理', '申请策略建议'].map((item) => (
              <span key={item} className="rounded-full bg-white/8 px-3 py-2 ring-1 ring-white/10">✓ {item}</span>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          <Link href="/assessment" className="rounded-2xl bg-white px-5 py-3.5 text-center text-sm font-black text-slate-950 shadow-sm transition hover:-translate-y-0.5">
            获取我的专属奖学金方案
          </Link>
          <AddWechatLink className="rounded-2xl border border-white/25 px-5 py-3.5 text-center text-sm font-black text-white transition hover:bg-white/10">
            复制顾问微信：{CONSULTANT_WECHAT}
          </AddWechatLink>
        </div>
      </div>
    </section>
  );
}
