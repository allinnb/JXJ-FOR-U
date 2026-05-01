import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 奖学金匹配 - 30秒自测你的海外留学奖学金申请背景",
  description:
    "AI 留学奖学金匹配助手，30 秒输入 GPA、目标国家、专业和预算，初筛海外全奖、半奖、学费减免机会，涵盖 211/985 及双非背景，并由顾问提供官网核验与申请策略建议。",
  keywords: ["留学奖学金", "AI奖学金匹配", "海外奖学金", "全奖", "半奖", "211", "985", "双非", "留学申请"],
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "AI 奖学金匹配 - 30秒自测你的海外留学奖学金申请背景",
    description:
      "输入 GPA、目标国家、专业和预算，初筛海外全奖/半奖机会，并由顾问提供官网核验与申请策略建议。",
    type: "website",
    locale: "zh_CN",
    siteName: "AI 留学奖学金匹配助手",
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
