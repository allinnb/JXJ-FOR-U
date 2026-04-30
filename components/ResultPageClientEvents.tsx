"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";
import type { MatchLevel } from "@/types";

interface ResultPageClientEventsProps {
  reportId: string;
  matchLevel: MatchLevel;
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
