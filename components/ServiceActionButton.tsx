"use client";

import { CONSULTANT_WECHAT } from "@/src/lib/config";
import { trackEvent, type AnalyticsEventName } from "@/src/lib/analytics";

type ServiceActionButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  eventName?: AnalyticsEventName;
  payload?: Record<string, unknown>;
};

export function ServiceActionButton({ children, variant = "primary", eventName = "click_full_report", payload = {} }: ServiceActionButtonProps) {
  const handleClick = () => {
    trackEvent(eventName, payload);
    window.alert(`请添加顾问微信 ${CONSULTANT_WECHAT} 获取完整服务。`);
  };

  const className =
    variant === "primary"
      ? "mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-brand-600 px-5 py-4 text-sm font-black text-white shadow-lg shadow-blue-100 transition hover:-translate-y-0.5 hover:bg-brand-700 sm:w-auto"
      : "mt-6 inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-black text-slate-900 transition hover:-translate-y-0.5 hover:border-brand-200 hover:text-brand-700 sm:w-auto";

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
