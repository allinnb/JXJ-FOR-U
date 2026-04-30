"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export function HomeVisitTracker() {
  useEffect(() => {
    trackEvent("visit_home");
  }, []);

  return null;
}
