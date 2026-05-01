import Link from "next/link";
import type { ReactNode } from "react";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[#f6f8fb] text-slate-950">
      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-5">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-xs font-black text-white shadow-sm">
              AI
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-black tracking-tight text-slate-950">留学奖学金匹配助手</span>
              <span className="block text-[11px] font-semibold text-slate-500">Scholarship Advisory Report</span>
            </span>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-3">
            <Link href="/scholarships" className="hidden rounded-full px-3 py-2 text-xs font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 sm:block">
              奖学金库
            </Link>
            <Link href="/assessment" className="rounded-full bg-brand-600 px-4 py-2.5 text-xs font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-700">
              免费测评
            </Link>
          </nav>
        </div>
      </header>
      {children}
    </main>
  );
}
