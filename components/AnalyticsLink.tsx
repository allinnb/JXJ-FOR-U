"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackEvent, type AnalyticsEventName } from "@/lib/analytics";

interface AnalyticsLinkProps {
  href: string;
  eventName: AnalyticsEventName;
  payload?: Record<string, unknown>;
  className?: string;
  children: ReactNode;
}

export function AnalyticsLink({ href, eventName, payload = {}, className, children }: AnalyticsLinkProps) {
  return (
    <Link href={href} className={className} onClick={() => trackEvent(eventName, payload)}>
      {children}
    </Link>
  );
}
