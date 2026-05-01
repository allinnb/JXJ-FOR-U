import { NextResponse } from "next/server";

// Lightweight analytics endpoint — stores events to console for now.
// Can be extended to write to Feishu Analytics table or external service.
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      events?: Array<{ eventName: string; payload?: Record<string, unknown>; timestamp: string }>;
    };

    if (!body.events || !Array.isArray(body.events) || body.events.length === 0) {
      return NextResponse.json({ success: false, error: "缺少 events 数组" }, { status: 400 });
    }

    // Log events server-side for debugging
    for (const event of body.events.slice(0, 50)) {
      console.log("[server-analytics]", event.eventName, event.payload, event.timestamp);
    }

    // TODO: Write to Feishu Analytics table when table is ready
    // TODO: Write to external analytics service (Umami, Plausible, etc.)

    return NextResponse.json({ success: true, count: body.events.length });
  } catch (error) {
    console.error("[api/analytics] failed", error);
    return NextResponse.json({ success: false, error: "Analytics 接收失败" }, { status: 500 });
  }
}
