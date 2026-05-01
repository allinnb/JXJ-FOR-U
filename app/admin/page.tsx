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
  const [reportLoading, setReportLoading] = useState(false);
  const [reportResult, setReportResult] = useState<{ success: boolean; reportUrl?: string; scholarshipCount?: number; highPriorityCount?: number; humanReviewCount?: number; error?: string } | null>(null);
  const [copyMessage, setCopyMessage] = useState("");

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

  async function handleGenerateFullReport() {
    if (!reportId.trim()) return;
    setReportLoading(true);
    setReportResult(null);
    setCopyMessage("");

    try {
      const res = await fetch("/api/admin/generate-full-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.NEXT_PUBLIC_ADMIN_KEY ? { "x-admin-key": process.env.NEXT_PUBLIC_ADMIN_KEY } : {}),
        },
        body: JSON.stringify({ reportId }),
      });
      const data = (await res.json()) as { success: boolean; reportUrl?: string; scholarshipCount?: number; highPriorityCount?: number; humanReviewCount?: number; error?: string };
      setReportResult(data);
    } catch (err) {
      setReportResult({ success: false, error: err instanceof Error ? err.message : "请求失败" });
    } finally {
      setReportLoading(false);
    }
  }

  async function handleCopyReportUrl() {
    if (!reportResult?.reportUrl) return;
    try {
      await navigator.clipboard.writeText(reportResult.reportUrl);
      setCopyMessage("完整报告链接已复制");
    } catch {
      setCopyMessage("复制失败，请手动复制链接");
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
          <h2 className="text-xl font-black text-slate-950">付费报告交付流程</h2>
          <p className="mt-2 text-sm text-slate-600">客户付款后，先用 AI 复核补充真实机会，再到飞书核验并填写顾问判断，最后生成完整报告链接发给客户。</p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {[
              ["1", "触发 AI 复核", "搜索官网、政府和基金会奖学金页面，并写入飞书 Scholarships 表。"],
              ["2", "飞书人工核验", "修改顾问判断、顾问优先级和顾问备注，移除不适合的机会。"],
              ["3", "生成报告链接", "系统读取飞书复核后的数据，生成 /report/{reportId} 交付链接。"],
            ].map(([step, title, desc]) => (
              <div key={step} className="rounded-2xl bg-blue-50 p-4 text-sm ring-1 ring-blue-100">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-xs font-black text-white">{step}</span>
                <p className="mt-3 font-black text-slate-950">{title}</p>
                <p className="mt-1 leading-6 text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-3 md:flex-row">
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
            <button
              type="button"
              onClick={handleGenerateFullReport}
              disabled={reportLoading || !reportId.trim()}
              className="rounded-2xl bg-slate-950 px-6 py-3 text-sm font-black text-white transition hover:bg-slate-800 disabled:opacity-50"
            >
              {reportLoading ? "生成中..." : "生成完整报告链接"}
            </button>
          </div>

          {reviewResult ? (
            <div className={`mt-4 rounded-2xl p-4 text-sm ring-1 ${reviewResult.success ? "bg-green-50 text-green-950 ring-green-100" : "bg-rose-50 text-rose-950 ring-rose-100"}`}>
              {reviewResult.success ? (
                <>
                  <p className="font-black">AI 复核完成</p>
                  <p className="mt-1">找到 {Array.isArray(reviewResult.candidates) ? reviewResult.candidates.length : 0} 个候选奖学金机会。</p>
                  {reviewResult.feishuWriteSuccess ? (
                    <p className="mt-1 text-green-700">✅ AI 复核结果已自动写入飞书 Scholarships 表。请先人工核验，再生成完整报告链接。</p>
                  ) : (
                    <p className="mt-1 text-amber-700">⚠️ AI 复核结果已生成，但写入飞书失败，请检查飞书配置。</p>
                  )}
                  <a
                    href="https://feishu.cn/base/HFD5bJChOaVYl8sWDegcaWMZnIA?table=tblt8OVCvgm2gKXt"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-xs text-brand-700 underline"
                  >
                    前往飞书 Scholarships 表核验 →
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

          {reportResult ? (
            <div className={`mt-4 rounded-2xl p-4 text-sm ring-1 ${reportResult.success ? "bg-blue-50 text-blue-950 ring-blue-100" : "bg-rose-50 text-rose-950 ring-rose-100"}`}>
              {reportResult.success ? (
                <>
                  <p className="font-black">完整报告链接已生成</p>
                  <p className="mt-1">共 {reportResult.scholarshipCount ?? 0} 个机会，高优先级 {reportResult.highPriorityCount ?? 0} 个，需重点核验 {reportResult.humanReviewCount ?? 0} 个。</p>
                  {(reportResult.scholarshipCount ?? 0) === 0 ? (
                    <p className="mt-2 rounded-xl bg-amber-50 px-3 py-2 text-amber-800 ring-1 ring-amber-100">当前报告还没有奖学金机会。建议先触发 AI 复核，或检查飞书 Scholarships 表中是否有该报告编号的数据。</p>
                  ) : null}
                  <div className="mt-3 rounded-xl bg-white px-3 py-2 text-xs text-slate-700 ring-1 ring-blue-100 break-all">{reportResult.reportUrl}</div>
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <button type="button" onClick={handleCopyReportUrl} className="rounded-xl bg-brand-600 px-4 py-2 text-xs font-black text-white">复制完整报告链接</button>
                    <a href={reportResult.reportUrl} target="_blank" rel="noreferrer" className="rounded-xl bg-slate-950 px-4 py-2 text-center text-xs font-black text-white">打开预览</a>
                  </div>
                  {copyMessage ? <p className="mt-2 text-xs font-bold text-brand-700">{copyMessage}</p> : null}
                </>
              ) : (
                <>
                  <p className="font-black">完整报告生成失败</p>
                  <p className="mt-1">{reportResult.error || "未知错误"}</p>
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
            <li>3. 客户付费后，输入报告编号触发 AI 复核，结果会自动写入 Scholarships 表和 AI Runs 表。</li>
            <li>4. 在 Scholarships 表中修改「顾问判断」「顾问优先级」「顾问备注」，把不适合的机会标记为 remove。</li>
            <li>5. 点击「生成完整报告链接」，复制 /report 链接发给客户。</li>
            <li>6. 联系用户后，在 Leads 表更新「跟进状态」「报告状态」「顾问备注」。</li>
          </ul>
        </div>
      </section>
    </PageShell>
  );
}
