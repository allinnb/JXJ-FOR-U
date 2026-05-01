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

// Batch-send analytics events to server endpoint
let pendingEvents: AnalyticsEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

function flushEvents() {
  if (pendingEvents.length === 0) return;
  const toSend = [...pendingEvents];
  pendingEvents = [];

  try {
    void fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ events: toSend }),
      keepalive: true,
    });
  } catch {
    // Silently fail — don't break user flow
  }
}

export function trackEvent(eventName: AnalyticsEventName, payload: Record<string, unknown> = {}) {
  const event: AnalyticsEvent = {
    eventName,
    payload,
    timestamp: new Date().toISOString(),
  };

  console.log("[analytics]", event);

  // Queue for server delivery
  pendingEvents.push(event);
  if (!flushTimer) {
    flushTimer = setTimeout(() => {
      flushTimer = null;
      flushEvents();
    }, 3000);
  }

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
