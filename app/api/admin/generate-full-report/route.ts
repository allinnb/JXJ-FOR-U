import { NextResponse } from "next/server";
import { getFullReportData } from "@/src/lib/feishu/reports";

function getBaseUrl(request: Request) {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (configuredUrl) return configuredUrl.replace(/\/$/, "");

  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}

export async function POST(request: Request) {
  const adminKey = process.env.ADMIN_API_KEY;
  if (adminKey) {
    const providedKey = request.headers.get("x-admin-key") || "";
    if (providedKey !== adminKey) {
      return NextResponse.json({ success: false, error: "无效的管理员密钥。" }, { status: 401 });
    }
  }

  try {
    const body = (await request.json()) as { reportId?: string };
    const reportId = body.reportId?.trim();
    if (!reportId) {
      return NextResponse.json({ success: false, error: "请求缺少 reportId。" }, { status: 400 });
    }

    const data = await getFullReportData(reportId);
    if (!data) {
      return NextResponse.json({ success: false, error: "未找到该报告，请确认报告编号是否正确。" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      reportId,
      reportUrl: `${getBaseUrl(request)}/report/${encodeURIComponent(reportId)}`,
      scholarshipCount: data.stats.scholarshipCount,
      highPriorityCount: data.stats.highPriorityCount,
      humanReviewCount: data.stats.humanReviewCount,
    });
  } catch (error) {
    console.error("[api/admin/generate-full-report] failed", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error && error.message.includes("缺少服务端环境变量") ? error.message : "完整报告生成失败，请稍后重试。",
      },
      { status: 200 },
    );
  }
}
