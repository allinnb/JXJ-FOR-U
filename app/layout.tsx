import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 留学奖学金匹配助手 | 测一测你的背景适合申请哪些奖学金",
  description:
    "输入 GPA、目标国家、专业和预算，AI 为你初筛可申请的海外奖学金方向，并由顾问提供官网核验与申请策略建议。",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "AI 留学奖学金匹配助手",
    description:
      "2 分钟生成你的海外奖学金机会初筛报告。覆盖英国、欧洲、澳洲、北美等方向。",
    type: "website",
    locale: "zh_CN",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}
