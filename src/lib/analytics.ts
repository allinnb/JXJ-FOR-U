const ANALYTICS_STORAGE_KEY = "scholarshipAnalyticsEvents";

export type AnalyticsEventName =
  | "visit_home"
  | "click_start_assessment"
  | "submit_assessment"
  | "view_result"
  | "click_copy_consultation"
  | "click_full_report"
  | "click_human_review"
  | "click_add_wechat";

export interface AnalyticsEvent {
  eventName: AnalyticsEventName;
  payload?: Record<string, unknown>;
  timestamp: string;
}

function canUseLocalStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function trackEvent(eventName: AnalyticsEventName, payload: Record<string, unknown> = {}) {
  const event: AnalyticsEvent = {
    eventName,
    payload,
    timestamp: new Date().toISOString(),
  };

  console.log("[analytics]", event);

  if (!canUseLocalStorage()) return;

  try {
    const rawEvents = window.localStorage.getItem(ANALYTICS_STORAGE_KEY);
    const events = rawEvents ? (JSON.parse(rawEvents) as AnalyticsEvent[]) : [];
    events.push(event);
    window.localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(events.slice(-100)));
  } catch (error) {
    console.warn("Failed to persist analytics event", error);
  }
}
