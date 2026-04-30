import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 留学奖学金匹配助手",
  description: "输入你的背景，AI 帮你动态搜索并推荐适合申请的海外奖学金机会。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
