"use client";

import { useEffect } from "react";
import { trackEvent } from "@/src/lib/analytics";

interface ResultPageClientEventsProps {
  reportId: string;
  matchLevel: string;
  overallMatchScore: number;
}

export function ResultPageClientEvents({ reportId, matchLevel, overallMatchScore }: ResultPageClientEventsProps) {
  useEffect(() => {
    trackEvent("view_result", {
      reportId,
      matchLevel,
      overallMatchScore,
    });
  }, [matchLevel, overallMatchScore, reportId]);

  return null;
}
