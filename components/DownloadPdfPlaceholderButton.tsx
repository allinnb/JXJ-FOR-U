"use client";

import { useState } from "react";

export function DownloadPdfPlaceholderButton() {
  const [showTip, setShowTip] = useState(false);

  function handleClick() {
    setShowTip(true);
    window.setTimeout(() => setShowTip(false), 2200);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleClick}
        className="w-full rounded-2xl border border-white/20 bg-white/10 px-5 py-3.5 text-sm font-black text-white transition hover:bg-white/15 sm:w-auto"
      >
        下载 PDF（即将开放）
      </button>
      {showTip ? (
        <div className="absolute right-0 top-full z-20 mt-2 w-64 rounded-2xl bg-white px-4 py-3 text-xs font-bold leading-5 text-slate-700 shadow-soft ring-1 ring-slate-100">
          PDF 导出功能已预留，后续可接入浏览器打印、服务端生成或邮件发送。
        </div>
      ) : null}
    </div>
  );
}
