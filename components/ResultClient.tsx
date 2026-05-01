"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AddWechatLink } from "@/components/AddWechatLink";
import { CopyConsultationButton } from "@/components/CopyConsultationButton";
import { CTASection } from "@/components/CTASection";
import { DownloadPdfPlaceholderButton } from "@/components/DownloadPdfPlaceholderButton";
import { ResultPageClientEvents } from "@/components/ResultPageClientEvents";
import { ServiceActionButton } from "@/components/ServiceActionButton";
import { CONSULTANT_WECHAT, DATA_VERSION, FREE_REPORT_LIMIT, FULL_REPORT_MAX_COUNT, FULL_REPORT_MIN_COUNT, MOCK_INTERNAL_DISCLAIMER, STORAGE_KEYS, TRUST_DISCLAIMER } from "@/src/lib/config";
import { matchLevelLabels, sourceReliabilityLabels, sourceTypeLabels } from "@/src/types";
import type { FeishuSyncStatus, MatchResult, Scholarship, UserProfile } from "@/src/types";

const fullReportItems = ["10–20 个奖学金机会", "官网链接", "截止日期", "资格要求", "匹配评分", "申请难度", "推荐优先级", "材料清单", "申请时间线", "顾问建议"];

const services = [
  { name: "免费简版报告", price: "¥0", originalPrice: "", tag: "当前页面", desc: "快速判断匹配评级、推荐方向、前 3 个初筛机会和关键风险。", points: ["整体匹配分", "前 3 个机会", "风险提示"], button: "查看当前简版" },
  { name: "完整 AI 奖学金报告", price: "¥99", originalPrice: "¥199", tag: "适合先自助规划", desc: "扩展到 10–20 个机会，并整理官网链接、截止日期、资格要求、材料清单和申请优先级。", points: ["10–20 个机会", "官网链接与截止日期", "材料清单与优先级"], button: "获取完整报告", featured: true },
  { name: "人工复核 + 申请策略", price: "¥699", originalPrice: "", tag: "限时首单优惠", desc: "顾问人工核验机会真实性，规划奖学金组合、文书重点、时间线和冲刺/稳妥策略。", points: ["人工官网核验", "申请组合策略", "材料与时间线建议"], button: "预约人工复核" },
];

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleString("zh-CN", { hour12: false });
  } catch {
    return value;
  }
}

function getOpportunityStats(scholarships: Scholarship[]) {
  return scholarships.reduce(
    (stats, scholarship) => {
      if (scholarship.aiConfidence >= 85 && scholarship.sourceReliability !== "low") stats.high += 1;
      else if (scholarship.aiConfidence >= 70) stats.medium += 1;
      else stats.low += 1;
      return stats;
    },
    { high: 0, medium: 0, low: 0 },
  );
}

function SkeletonLoader() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-14 pt-6 sm:px-5 md:pt-10">
      <div className="h-12 animate-pulse rounded-2xl bg-slate-100" />
      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_18rem]">
        <div className="h-72 animate-pulse rounded-[2rem] bg-slate-100" />
        <div className="h-72 animate-pulse rounded-[2rem] bg-slate-100" />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {[1, 2, 3].map((i) => <div key={i} className="h-64 animate-pulse rounded-[2rem] bg-slate-100" />)}
      </div>
    </section>
  );
}

function ScholarshipCard({ item, index }: { item: Scholarship; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-slate-200/70 transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-black text-slate-600">机会 {index + 1}</span>
          <h3 className="mt-3 text-lg font-black leading-snug text-slate-950">{item.name}</h3>
        </div>
        <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black text-brand-700">{item.aiConfidence}%</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-bold text-slate-600">
        <div className="rounded-2xl bg-slate-50 px-3 py-2 ring-1 ring-slate-100"><span className="block text-slate-400">国家/地区</span>{item.country}</div>
        <div className="rounded-2xl bg-slate-50 px-3 py-2 ring-1 ring-slate-100"><span className="block text-slate-400">金额</span>{item.amount}</div>
        <div className="rounded-2xl bg-slate-50 px-3 py-2 ring-1 ring-slate-100"><span className="block text-slate-400">截止日期</span>{item.deadline}</div>
        <div className="rounded-2xl bg-slate-50 px-3 py-2 ring-1 ring-slate-100"><span className="block text-slate-400">可靠性</span>{sourceReliabilityLabels[item.sourceReliability]}</div>
      </div>

      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <p><strong className="text-slate-900">学校/机构：</strong>{item.institution}</p>
        <p><strong className="text-slate-900">适合学历：</strong>{Array.isArray(item.degreeLevel) ? item.degreeLevel.join(" / ") : item.degreeLevel}</p>
        <p><strong className="text-slate-900">类型：</strong>{item.scholarshipType}</p>
      </div>

      <button type="button" onClick={() => setExpanded(!expanded)} className="mt-4 w-full rounded-2xl bg-slate-50 px-4 py-3 text-left text-xs font-black text-brand-600 ring-1 ring-slate-100 md:hidden">
        {expanded ? "收起详情 ▲" : "展开匹配理由与风险 ▼"}
      </button>

      <div className={`mt-4 space-y-3 ${expanded ? "" : "hidden md:block"}`}>
        <div className="grid gap-2 text-xs font-bold text-slate-700 sm:grid-cols-2">
          <span className="rounded-2xl bg-slate-50 px-3 py-2">来源类型：{sourceTypeLabels[item.sourceType]}</span>
          <span className="rounded-2xl bg-slate-50 px-3 py-2">最近验证：{item.lastVerifiedAt}</span>
          <span className="rounded-2xl bg-slate-50 px-3 py-2">人工复核：{item.requiresHumanReview ? "建议" : "可选"}</span>
          <span className="rounded-2xl bg-slate-50 px-3 py-2">官网：需核验</span>
        </div>
        <div className="rounded-2xl bg-blue-50 p-4 text-sm leading-6 text-slate-800 ring-1 ring-blue-100"><strong>匹配理由：</strong>{item.matchReason}</div>
        <div className="rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-950 ring-1 ring-amber-100"><strong>风险提示：</strong>{item.risks}</div>
      </div>
      <a href={item.officialUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex text-sm font-black text-brand-600">官网链接占位 →</a>
    </article>
  );
}

export function ResultClient() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [syncStatus, setSyncStatus] = useState<FeishuSyncStatus | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [versionMismatch, setVersionMismatch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const rawProfile = localStorage.getItem(STORAGE_KEYS.userProfile);
      const rawResult = localStorage.getItem(STORAGE_KEYS.matchResult);
      const rawSync = localStorage.getItem(STORAGE_KEYS.feishuSyncStatus);
      const storedVersion = localStorage.getItem("scholarshipDataVersion");

      if (!rawProfile || !rawResult) {
        setLoadError(true);
        setIsLoading(false);
        return;
      }

      if (storedVersion && storedVersion !== DATA_VERSION) setVersionMismatch(true);

      localStorage.setItem("scholarshipDataVersion", DATA_VERSION);
      setUserProfile(JSON.parse(rawProfile) as UserProfile);
      setMatchResult(JSON.parse(rawResult) as MatchResult);
      if (rawSync) setSyncStatus(JSON.parse(rawSync) as FeishuSyncStatus);
    } catch (error) {
      console.warn("Failed to read result from localStorage", error);
      setLoadError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (syncStatus?.status !== "pending") return;
    const interval = window.setInterval(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.feishuSyncStatus);
        if (!raw) return;
        const parsed = JSON.parse(raw) as FeishuSyncStatus;
        if (parsed.status !== "pending") {
          setSyncStatus(parsed);
          window.clearInterval(interval);
        }
      } catch {
        // ignore parse errors during polling
      }
    }, 1500);
    return () => window.clearInterval(interval);
  }, [syncStatus?.status]);

  const opportunityStats = useMemo(() => getOpportunityStats(matchResult?.recommendedScholarships || []), [matchResult]);

  if (isLoading) return <SkeletonLoader />;

  if (loadError || versionMismatch) {
    return (
      <section className="mx-auto max-w-2xl px-5 py-14">
        <div className="rounded-[2rem] bg-white p-7 text-center shadow-sm ring-1 ring-slate-200/70 md:p-10">
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700 ring-1 ring-amber-100">{versionMismatch ? "报告版本已更新" : "缺少测评信息"}</span>
          <h1 className="mt-5 text-3xl font-black text-slate-950">{versionMismatch ? "请重新生成报告" : "请先完成免费测评"}</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            {versionMismatch ? "系统已更新，为确保报告信息准确，请重新填写测评表单生成最新报告。" : "结果页需要从本机读取你的学历、目标国家、GPA、预算和报告信息。如果你更换了设备或清空了浏览器缓存，请重新测评。"}
          </p>
          <Link href="/assessment" className="mt-6 inline-flex rounded-2xl bg-brand-600 px-6 py-4 text-sm font-black text-white shadow-sm">{versionMismatch ? "重新测评" : "返回测评页"}</Link>
        </div>
      </section>
    );
  }

  if (!userProfile || !matchResult) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-5 md:pt-10">
      <ResultPageClientEvents reportId={matchResult.reportId} matchLevel={matchLevelLabels[matchResult.matchLevel]} overallMatchScore={matchResult.matchScore} />
      <div className="mb-5 rounded-2xl bg-amber-50 px-5 py-4 text-sm font-bold leading-6 text-amber-950 ring-1 ring-amber-100">{TRUST_DISCLAIMER}</div>
      {syncStatus && syncStatus.status === "pending" ? <div className="mb-5 rounded-2xl bg-blue-50 px-5 py-4 text-sm font-bold leading-6 text-blue-800 ring-1 ring-blue-100">报告已生成，后台正在同步数据到飞书顾问工作台，通常几秒内完成。</div> : null}
      {syncStatus && syncStatus.status === "failed" ? <div className="mb-5 rounded-2xl bg-rose-50 px-5 py-4 text-sm font-bold leading-6 text-rose-800 ring-1 ring-rose-100">报告已生成，但后台同步失败。你可以添加顾问微信 {CONSULTANT_WECHAT} 获取人工复核。</div> : null}
      {syncStatus && !syncStatus.status && !syncStatus.success ? <div className="mb-5 rounded-2xl bg-rose-50 px-5 py-4 text-sm font-bold leading-6 text-rose-800 ring-1 ring-rose-100">报告已生成，但后台同步失败。你可以添加顾问微信 {CONSULTANT_WECHAT} 获取人工复核。</div> : null}

      {/* Report cover */}
      <div className="rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-200/70">
        <div className="grid gap-6 p-6 md:grid-cols-[1fr_18rem] md:p-9">
          <div>
            <div className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-brand-700 ring-1 ring-blue-100">奖学金匹配报告 · 内部试用版</div>
            <h1 className="mt-5 max-w-3xl text-3xl font-black leading-tight tracking-tight text-slate-950 md:text-5xl">你的整体匹配评级：{matchLevelLabels[matchResult.matchLevel]}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">{MOCK_INTERNAL_DISCLAIMER}</p>
            <div className="mt-6 grid gap-2 text-xs font-bold text-slate-600 sm:grid-cols-2 lg:grid-cols-4">
              <span className="rounded-full bg-slate-50 px-3 py-2 ring-1 ring-slate-100">报告编号：{matchResult.reportId}</span>
              <span className="rounded-full bg-slate-50 px-3 py-2 ring-1 ring-slate-100">生成时间：{formatDate(matchResult.createdAt)}</span>
              <span className="rounded-full bg-slate-50 px-3 py-2 ring-1 ring-slate-100">匹配等级：{matchLevelLabels[matchResult.matchLevel]}</span>
              <span className="rounded-full bg-slate-50 px-3 py-2 ring-1 ring-slate-100">匹配分数：{matchResult.matchScore}/100</span>
            </div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <DownloadPdfPlaceholderButton />
              <AddWechatLink payload={{ reportId: matchResult.reportId, source: "result_header" }} className="inline-flex justify-center rounded-2xl bg-slate-950 px-5 py-4 text-sm font-black text-white">复制顾问微信：{CONSULTANT_WECHAT}</AddWechatLink>
            </div>
          </div>
          <div className="rounded-[1.75rem] bg-slate-950 p-6 text-center text-white shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-100">Match Score</p>
            <div className="mt-4 text-6xl font-black">{matchResult.matchScore}</div>
            <div className="mt-2 text-sm font-black text-slate-300">/ 100</div>
            <div className="mt-5 rounded-full bg-white px-4 py-2 text-sm font-black text-slate-950">{matchLevelLabels[matchResult.matchLevel]}匹配</div>
            <div className="mt-5 grid grid-cols-3 gap-2 text-[11px] font-black">
              <span className="rounded-xl bg-white/10 px-2 py-2 text-green-100">高 {opportunityStats.high}</span>
              <span className="rounded-xl bg-white/10 px-2 py-2 text-blue-100">中 {opportunityStats.medium}</span>
              <span className="rounded-xl bg-white/10 px-2 py-2 text-slate-200">低 {opportunityStats.low}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-blue-50 px-5 py-4 text-sm font-bold leading-6 text-brand-800 ring-1 ring-blue-100">
        本报告基于 {formatDate(matchResult.createdAt)} 的数据生成。奖学金截止日期可能随时更新，建议尽快与顾问确认最新信息。
      </div>

      {/* Profile + Direction */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <aside className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200/70 md:p-7">
          <p className="text-sm font-black text-brand-600">Student Profile</p>
          <h2 className="mt-1 text-xl font-black text-slate-950">用户背景摘要</h2>
          <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-1">
            {[["当前学历", userProfile.currentEducation], ["目标学历", userProfile.targetDegree], ["目标国家", userProfile.targetCountry], ["专业方向", userProfile.targetMajor], ["入学时间", userProfile.intakeTime], ["学校背景", userProfile.schoolBackground], ["GPA/均分", userProfile.gpa], ["语言成绩", userProfile.languageScore], ["家庭预算", userProfile.budget]].map(([key, value]) => (
              <div key={key} className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100"><dt className="text-xs font-bold text-slate-400">{key}</dt><dd className="mt-1 font-black text-slate-900">{value}</dd></div>
            ))}
          </dl>
        </aside>

        <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200/70 md:p-7">
          <p className="text-sm font-black text-brand-600">Recommended Direction</p>
          <h2 className="mt-1 text-xl font-black text-slate-950">推荐国家方向</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {matchResult.recommendedCountries.map((country, index) => <span key={country} className="rounded-full bg-blue-50 px-4 py-2 text-sm font-black text-brand-700 ring-1 ring-blue-100">{index === 0 ? "优先方向" : "可拓展方向"} · {country}</span>)}
          </div>
          <div className="mt-6 rounded-3xl bg-slate-50 p-5 text-sm leading-7 text-slate-700 ring-1 ring-slate-100">
            <strong className="text-slate-950">免费展示前 {FREE_REPORT_LIMIT} 个机会，完整报告包含 {FULL_REPORT_MIN_COUNT}–{FULL_REPORT_MAX_COUNT} 个机会。</strong> 完整报告会补充截止日期、官网链接、申请材料清单、优先级排序，并标注哪些项目值得人工重点复核。
          </div>
          <AddWechatLink payload={{ reportId: matchResult.reportId }} className="mt-6 inline-flex w-full justify-center rounded-2xl bg-brand-600 px-5 py-4 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-700 sm:w-auto">添加顾问微信，获取人工复核</AddWechatLink>
        </section>
      </div>

      <section className="mt-8">
        <p className="text-sm font-black text-brand-600">Mock Opportunities</p>
        <h2 className="mt-1 text-2xl font-black text-slate-950">免费展示前 {FREE_REPORT_LIMIT} 个奖学金机会</h2>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {matchResult.recommendedScholarships.slice(0, FREE_REPORT_LIMIT).map((item, index) => <ScholarshipCard key={item.id} item={item} index={index} />)}
        </div>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200/70">
          <p className="text-sm font-black text-rose-600">Risk Notes</p>
          <h2 className="mt-1 text-xl font-black text-slate-950">主要风险</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">{matchResult.risks.map((risk, index) => <li key={risk} className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100"><strong>风险 {index + 1}：</strong>{risk}</li>)}</ul>
        </div>
        <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200/70">
          <p className="text-sm font-black text-brand-600">Action Plan</p>
          <h2 className="mt-1 text-xl font-black text-slate-950">下一步建议</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">{matchResult.nextSteps.map((step, index) => <li key={step} className="rounded-2xl bg-blue-50 px-4 py-3 text-slate-800 ring-1 ring-blue-100"><strong>步骤 {index + 1}：</strong>{step}</li>)}</ul>
        </div>
        <CopyConsultationButton userProfile={userProfile} matchResult={matchResult} mode="summary" />
        <CopyConsultationButton userProfile={userProfile} matchResult={matchResult} />
      </section>

      <section className="mt-8 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200/70 md:p-8">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="text-sm font-black text-brand-600">Full Report Upgrade</p>
            <h2 className="mt-2 text-2xl font-black leading-tight text-slate-950 md:text-3xl">完整报告将包含</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">完整报告包含 {FULL_REPORT_MIN_COUNT}–{FULL_REPORT_MAX_COUNT} 个机会、官网链接、截止日期、资格要求、材料清单、申请优先级和顾问建议。</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <ServiceActionButton eventName="click_full_report" payload={{ reportId: matchResult.reportId }}>获取 ¥99 完整 AI 报告</ServiceActionButton>
              <ServiceActionButton variant="secondary" eventName="click_human_review" payload={{ reportId: matchResult.reportId }}>预约 ¥699 人工复核咨询</ServiceActionButton>
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-400">按钮暂不接入支付，点击后会提示添加顾问微信 {CONSULTANT_WECHAT} 获取完整服务。</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
            {fullReportItems.map((item, index) => (
              <div key={item} className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100">
                <p className="text-xs font-black text-brand-600">{String(index + 1).padStart(2, "0")}</p>
                <p className="mt-1 text-sm font-black text-slate-900">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-5">
          <p className="text-sm font-black text-brand-600">Service Options</p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">如果要继续推进，可以选择这些服务</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {services.map((service) => (
            <div key={service.name} className={`rounded-[2rem] p-6 shadow-sm ring-1 ${service.featured ? "bg-slate-950 text-white ring-slate-800" : "bg-white text-slate-950 ring-slate-200/70"}`}>
              <div className="flex items-center gap-2">
                <div className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${service.featured ? "bg-white/10 text-blue-100" : "bg-blue-50 text-brand-700"}`}>{service.tag}</div>
                {service.featured ? <span className="inline-flex rounded-full bg-white px-2.5 py-0.5 text-[10px] font-black text-slate-950">热门</span> : null}
              </div>
              <div className="mt-5 flex items-baseline gap-2"><p className="text-4xl font-black">{service.price}</p>{service.originalPrice ? <span className="text-lg font-bold text-slate-400 line-through">{service.originalPrice}</span> : null}</div>
              <h3 className="mt-3 text-xl font-black">{service.name}</h3>
              <p className={`mt-3 min-h-20 text-sm leading-6 ${service.featured ? "text-slate-300" : "text-slate-600"}`}>{service.desc}</p>
              <ul className={`mt-4 space-y-2 text-sm ${service.featured ? "text-slate-200" : "text-slate-700"}`}>{service.points.map((point) => <li key={point}>✓ {point}</li>)}</ul>
              {service.price === "¥99" ? <ServiceActionButton eventName="click_full_report" payload={{ reportId: matchResult.reportId, source: "service_card" }}>获取完整报告</ServiceActionButton> : service.price === "¥699" ? <ServiceActionButton eventName="click_human_review" payload={{ reportId: matchResult.reportId, source: "service_card" }} variant={service.featured ? "primary" : "secondary"}>预约人工复核</ServiceActionButton> : <ServiceActionButton eventName="click_add_wechat" payload={{ reportId: matchResult.reportId, source: "free_card" }} variant="secondary">查看当前简版</ServiceActionButton>}
            </div>
          ))}
        </div>
      </section>

      <div className="mt-8 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <CTASection />
        <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200/70 md:p-8">
          <p className="text-sm font-black text-brand-600">Need a second opinion?</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">预约完整奖学金申请策略</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">顾问会结合你的目标国家、预算、成绩和经历，判断哪些机会值得投入申请成本，并帮你拆解材料准备节奏。</p>
          <Link href="/assessment" className="mt-6 inline-flex rounded-2xl border border-slate-200 px-5 py-3.5 text-sm font-black text-slate-800 transition hover:border-brand-200 hover:text-brand-700">重新测评</Link>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-white px-5 py-4 text-center text-sm text-slate-600 ring-1 ring-slate-200/70">
        <span className="font-black text-slate-900">本周已有 23 位同学</span> 获取了奖学金初筛报告，其中 8 位已预约人工复核咨询。
      </div>
    </section>
  );
}
