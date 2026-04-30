import Link from "next/link";
import type { ReactNode } from "react";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#dbeafe,_transparent_34%),linear-gradient(180deg,_#f8fbff_0%,_#f8fafc_45%,_#ffffff_100%)] text-slate-950">
      <header className="sticky top-0 z-20 border-b border-white/70 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-600 text-sm font-black text-white shadow-lg shadow-blue-100">
              AI
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-black tracking-tight text-slate-950">留学奖学金匹配助手</span>
              <span className="block text-[11px] font-semibold text-slate-500">Scholarship Matching Report</span>
            </span>
          </Link>
          <Link href="/assessment" className="rounded-full bg-slate-950 px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-slate-200 transition hover:-translate-y-0.5 hover:bg-brand-700">
            免费测评
          </Link>
        </div>
      </header>
      {children}
    </main>
  );
}
