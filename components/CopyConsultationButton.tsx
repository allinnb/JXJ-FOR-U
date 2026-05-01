"use client";

import { useMemo, useState } from "react";
import { CONSULTANT_WECHAT } from "@/src/lib/config";
import { trackEvent } from "@/src/lib/analytics";
import { generateAdvisorInternalText, generateConsultationText } from "@/src/lib/consultationText";
import { matchLevelLabels } from "@/src/types";
import type { MatchResult, UserProfile } from "@/src/types";

interface CopyConsultationButtonProps {
  userProfile: UserProfile;
  matchResult: MatchResult;
  mode?: "consultation" | "summary";
}

export function CopyConsultationButton({ userProfile, matchResult, mode = "consultation" }: CopyConsultationButtonProps) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");

  const consultationText = useMemo(() => generateAdvisorInternalText(userProfile, matchResult), [userProfile, matchResult]);
  const reportSummaryText = useMemo(
    () =>
      [
        `AI 留学奖学金匹配简版报告（${matchResult.reportId}）`,
        `生成时间：${new Date(matchResult.createdAt).toLocaleString("zh-CN", { hour12: false })}`,
        `目标：${userProfile.targetDegree} · ${userProfile.targetCountry} · ${userProfile.targetMajor}`,
        `整体匹配评级：${matchLevelLabels[matchResult.matchLevel]}`,
        `匹配分数：${matchResult.matchScore}/100`,
        `推荐国家方向：${matchResult.recommendedCountries.join("、") || "待进一步确认"}`,
        "",
        "初筛奖学金机会：",
        ...matchResult.recommendedScholarships.map((item, index) => `${index + 1}. ${item.name}｜${item.country}｜${item.scholarshipType}｜AI 置信度 ${item.aiConfidence}%`),
        "",
        "重要提示：AI 初筛仅供参考，以官网和人工复核为准。",
        `顾问微信：${CONSULTANT_WECHAT}`,
      ].join("\n"),
    [userProfile, matchResult],
  );

  const isSummary = mode === "summary";
  const copyText = isSummary ? reportSummaryText : consultationText;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(isSummary ? copyText : generateConsultationText(userProfile, matchResult));
      trackEvent("click_copy_consultation", {
        reportId: matchResult.reportId,
        mode,
        leadQuality: matchResult.leadQuality,
      });
      setCopyStatus("copied");
      window.setTimeout(() => setCopyStatus("idle"), 2200);
    } catch (error) {
      console.warn("Failed to copy consultation text", error);
      setCopyStatus("failed");
    }
  }

  return (
    <div className="relative rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100 md:p-7">
      <p className="text-sm font-black text-brand-600">{isSummary ? "Report Summary" : "Lead Capture"}</p>
      <h2 className="mt-1 text-xl font-black text-slate-950">{isSummary ? "复制报告摘要" : "复制咨询信息，发给顾问"}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        {isSummary ? "一键复制简版报告摘要，方便保存、转发或后续做人工复核。" : `复制用户背景、匹配等级、预算、奖学金偏好和咨询诉求，可直接发给顾问微信 ${CONSULTANT_WECHAT}。`}
      </p>
      <div className="mt-4 max-h-64 overflow-auto rounded-2xl bg-slate-50 p-4 text-xs leading-6 text-slate-600 ring-1 ring-slate-100">
        <pre className="whitespace-pre-wrap font-sans">{copyText}</pre>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        className="mt-5 w-full rounded-2xl bg-brand-600 px-5 py-4 text-sm font-black text-white shadow-lg shadow-blue-100 transition hover:-translate-y-0.5 hover:bg-brand-700"
      >
        {copyStatus === "copied" ? "已复制" : isSummary ? "复制报告摘要" : "复制咨询信息，发给顾问"}
      </button>
      {copyStatus === "failed" ? <p className="mt-3 text-xs leading-5 text-rose-600">复制失败，请手动选中文本复制。</p> : null}
      {copyStatus === "copied" ? <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-soft">复制成功，可发送给顾问微信</div> : null}
    </div>
  );
}
