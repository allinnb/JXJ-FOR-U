import { NextResponse } from "next/server";
import { createLeadRecord } from "@/src/lib/feishu/leads";
import { createScholarshipRecords } from "@/src/lib/feishu/scholarships";
import type { LeadRecord, MatchResult, UserProfile } from "@/src/types";

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { userProfile?: UserProfile; matchResult?: MatchResult };
    const { userProfile, matchResult } = body;

    if (!isObject(userProfile) || !isObject(matchResult) || typeof matchResult.reportId !== "string") {
      return NextResponse.json({ success: false, error: "请求缺少 userProfile 或 matchResult。" }, { status: 400 });
    }

    const leadRecord: LeadRecord = {
      reportId: matchResult.reportId,
      createdAt: matchResult.createdAt || new Date().toISOString(),
      userProfile,
      matchResult,
      followupStatus: "new",
      reportStatus: matchResult.reportStatus,
      consultantNotes: "",
    };

    await createLeadRecord(leadRecord);
    await createScholarshipRecords(matchResult.reportId, matchResult.recommendedScholarships || []);

    return NextResponse.json({ success: true, reportId: matchResult.reportId });
  } catch (error) {
    console.error("[api/leads] sync failed", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error && error.message.includes("缺少服务端环境变量") ? error.message : "后台同步失败，请稍后重试或联系顾问。",
      },
      { status: 200 },
    );
  }
}
