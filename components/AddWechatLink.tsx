"use client";

import { CONSULTANT_WECHAT } from "@/src/lib/config";
import { trackEvent } from "@/src/lib/analytics";

interface AddWechatLinkProps {
  className: string;
  children: React.ReactNode;
  payload?: Record<string, unknown>;
}

export function AddWechatLink({ className, children, payload = {} }: AddWechatLinkProps) {
  const handleClick = async () => {
    trackEvent("click_add_wechat", payload);
    try {
      await navigator.clipboard.writeText(CONSULTANT_WECHAT);
      window.alert(`顾问微信 ${CONSULTANT_WECHAT} 已复制，请到微信添加。`);
    } catch {
      window.alert(`请手动添加顾问微信：${CONSULTANT_WECHAT}`);
    }
  };

  return (
    <button type="button" className={className} onClick={handleClick}>
      {children}
    </button>
  );
}
