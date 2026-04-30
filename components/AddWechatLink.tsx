"use client";

import { trackEvent } from "@/lib/analytics";

interface AddWechatLinkProps {
  className: string;
  children: React.ReactNode;
  payload?: Record<string, unknown>;
}

export function AddWechatLink({ className, children, payload = {} }: AddWechatLinkProps) {
  return (
    <a href="mailto:consultant@example.com" className={className} onClick={() => trackEvent("click_add_wechat", payload)}>
      {children}
    </a>
  );
}
