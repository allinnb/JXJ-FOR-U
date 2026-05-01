"use client";

import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { CONSULTANT_WECHAT } from "@/src/lib/config";

const ADMIN_PASSWORD = "jxj2026"; // Simple password gate for MVP

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // AI Review state
  const [reportId, setReportId] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewResult, setReviewResult] = useState<{ success: boolean; candidates?: unknown[]; error?: string; feishuWriteSuccess?: boolean } | null>(null);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setError("");
    } else {
      setError("密码错误");
    }
  }

  async function handleRunAIReview() {
    if (!reportId.trim()) return;
    setReviewLoading(true);
    setReviewResult(null);

    try {
      const storedProfile = localStorage.getItem("scholarshipUserProfile");
      const userProfile = storedProfile ? JSON.parse(storedProfile) : {};

      const res = await fetch("/api/admin/run-ai-review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.NEXT_PUBLIC_ADMIN_KEY ? { "x-admin-key": process.env.NEXT_PUBLIC_ADMIN_KEY } : {}),
        },
        body: JSON.stringify({ reportId, userProfile }),
      });
      const data = (await res.json()) as { success: boolean; candidates?: unknown[]; error?: string; feishuWriteSuccess?: boolean };
      setReviewResult(data);
    } catch (err) {
      setReviewResult({ success: false, error: err instanceof Error ? err.message : "请求失败" });
    } finally {
      setReviewLoading(false);
    }
  }

  if (!authenticated) {
    return (
      <PageShell>
        <section className="mx-auto max-w-sm px-5 py-20">
          <div className="rounded-[2rem] bg-white p-7 shadow-soft ring-1 ring-slate-100">
            <h1 className="text-2xl font-black text-slate-950">顾问后台</h1>
            <p className="mt-2 text-sm text-slate-600">请输入管理密码。</p>
            <form onSubmit={handleLogin} className="mt-5 space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="管理密码"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-blue-50"
              />
              {error ? <p className="text-sm text-rose-600">{error}</p> : null}
              <button type="submit" className="w-full rounded-2xl bg-brand-600 px-6 py-3 text-sm font-black text-white">登录</button>
            </form>
          </div>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="mx-auto max-w-4xl px-5 pb-14 pt-8">
        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-brand-700 ring-1 ring-blue-100">Admin Panel</span>
        <h1 className="mt-4 text-3xl font-black text-slate-950">顾问工作台</h1>
        <p className="mt-2 text-sm text-slate-600">顾问微信：{CONSULTANT_WECHAT} · 在此触发 AI 搜索复核、查看线索。</p>

        {/* Quick links */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <a href="https://feishu.cn/base/HFD5bJChOaVYl8sWDegcaWMZnIA?table=tblBRlgBEVL5v1xq" target="_blank" rel="noreferrer" className="rounded-[2rem] bg-white p-5 text-center shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-soft">
            <p className="text-2xl font-black text-brand-700">Leads</p>
            <p className="mt-2 text-xs text-slate-500">查看飞书客户表</p>
          </a>
          <a href="https://feishu.cn/base/HFD5bJChOaVYl8sWDegcaWMZnIA?table=tblt8OVCvgm2gKXt" target="_blank" rel="noreferrer" className="rounded-[2rem] bg-white p-5 text-center shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-soft">
            <p className="text-2xl font-black text-brand-700">Scholarships</p>
            <p className="mt-2 text-xs text-slate-500">查看飞书奖学金表</p>
          </a>
          <a href="https://feishu.cn/base/HFD5bJChOaVYl8sWDegcaWMZnIA?table=tblZFPveSOBPmS6d" target="_blank" rel="noreferrer" className="rounded-[2rem] bg-white p-5 text-center shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-soft">
            <p className="text-2xl font-black text-brand-700">AI Runs</p>
            <p className="mt-2 text-xs text-slate-500">查看 AI 运行记录</p>
          </a>
        </div>

        {/* AI Review trigger */}
        <div className="mt-8 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100 md:p-8">
          <h2 className="text-xl font-black text-slate-950">手动触发 AI 复核</h2>
          <p className="mt-2 text-sm text-slate-600">输入报告编号，系统将调用 OpenRouter + Exa 搜索真实奖学金信息。</p>
          <div className="mt-4 flex gap-3">
            <input
              type="text"
              value={reportId}
              onChange={(e) => setReportId(e.target.value)}
              placeholder="报告编号，如 SCH-2026-ABC123"
              className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-blue-50"
            />
            <button
              type="button"
              onClick={handleRunAIReview}
              disabled={reviewLoading || !reportId.trim()}
              className="rounded-2xl bg-brand-600 px-6 py-3 text-sm font-black text-white transition hover:bg-brand-700 disabled:opacity-50"
            >
              {reviewLoading ? "搜索中..." : "触发 AI 复核"}
            </button>
          </div>

          {reviewResult ? (
            <div className={`mt-4 rounded-2xl p-4 text-sm ring-1 ${reviewResult.success ? "bg-green-50 text-green-950 ring-green-100" : "bg-rose-50 text-rose-950 ring-rose-100"}`}>
              {reviewResult.success ? (
                <>
                  <p className="font-black">AI 复核完成</p>
                  <p className="mt-1">找到 {Array.isArray(reviewResult.candidates) ? reviewResult.candidates.length : 0} 个候选奖学金机会。</p>
                  {reviewResult.feishuWriteSuccess ? (
                    <p className="mt-1 text-green-700">✅ AI 复核结果已自动写入飞书 Scholarships 表。</p>
                  ) : (
                    <p className="mt-1 text-amber-700">⚠️ AI 复核结果已生成，但写入飞书失败，请检查飞书配置。</p>
                  )}
                  <a
                    href="https://feishu.cn/base/HFD5bJChOaVYl8sWDegcaWMZnIA?table=tblt8OVCvgm2gKXt"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-xs text-brand-700 underline"
                  >
                    前往飞书 Scholarships 表查看 →
                  </a>
                </>
              ) : (
                <>
                  <p className="font-black">AI 复核失败</p>
                  <p className="mt-1">{reviewResult.error || "未知错误"}</p>
                </>
              )}
            </div>
          ) : null}
        </div>

        {/* Instructions */}
        <div className="mt-8 rounded-[2rem] bg-slate-50 p-6 ring-1 ring-slate-100 md:p-8">
          <h2 className="text-xl font-black text-slate-950">使用说明</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
            <li>1. 在飞书 Leads 表中查看新提交的用户信息和匹配等级。</li>
            <li>2. 根据线索等级（hot/warm/cold）判断跟进优先级。</li>
            <li>3. 对需要 AI 深度搜索的报告，输入报告编号触发 AI 复核。</li>
            <li>4. AI 复核结果会自动写入飞书 Scholarships 表和 AI Runs 表。</li>
            <li>5. 在 Scholarships 表中修改「顾问判断」「顾问优先级」「顾问备注」。</li>
            <li>6. 联系用户时，参考系统推荐的服务套餐和跟进方式。</li>
          </ul>
        </div>
      </section>
    </PageShell>
  );
}
