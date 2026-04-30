import Link from "next/link";
import type { ReactNode } from "react";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-slate-50 to-white">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
        <Link href="/" className="text-sm font-bold tracking-tight text-brand-700">
          AI Scholarship Matcher
        </Link>
        <Link href="/assessment" className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm">
          免费测评
        </Link>
      </header>
      {children}
    </main>
  );
}
