"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { trackEvent } from "@/lib/analytics";

const selectFields = [
  { name: "currentEducation", label: "当前学历", options: ["高中/国际高中", "本科", "硕士", "博士", "其他"] },
  { name: "targetDegree", label: "目标学历", options: ["本科", "硕士", "博士", "交换/访学"] },
  { name: "schoolBackground", label: "学校背景", options: ["985", "211", "双非", "海外院校", "国际学校", "其他"] },
  { name: "scholarshipPreference", label: "期望奖学金类型", options: ["全奖", "半奖", "学费减免", "生活补助", "都可以"] },
  { name: "acceptNonPopular", label: "是否接受非热门国家或非热门院校", options: ["是", "否"] },
  { name: "needConsulting", label: "是否需要人工申请辅导", options: ["是", "否"] },
];

const inputFields = [
  { name: "targetCountries", label: "目标国家/地区", placeholder: "如：英国、美国、加拿大、欧洲", type: "text" },
  { name: "majorDirection", label: "目标专业方向", placeholder: "如：商科、计算机、教育、工程", type: "text" },
  { name: "intakeTime", label: "入学时间", placeholder: "如：2026 Fall", type: "text" },
  { name: "gpa", label: "GPA 或均分", placeholder: "如：3.5/4.0 或 86/100", type: "text" },
  { name: "languageScore", label: "语言成绩", placeholder: "如：雅思 7.0 / 托福 100", type: "text" },
  { name: "familyBudget", label: "家庭预算", placeholder: "如：低预算 / 20-30万 / 50万以上", type: "text" },
  { name: "wechat", label: "微信号", placeholder: "用于顾问发送完整报告", type: "text" },
  { name: "email", label: "邮箱", placeholder: "用于接收报告备份", type: "email" },
];

const analysisMessages = [
  "正在分析你的学术背景",
  "正在生成目标国家搜索策略",
  "正在匹配适合的奖学金类型",
  "正在评估申请难度与风险",
  "正在生成简版报告",
];

const requiredFields = [...selectFields.map((field) => field.name), ...inputFields.map((field) => field.name), "experiences"];

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function AssessmentPage() {
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [formError, setFormError] = useState("");

  const progressWidth = useMemo(() => `${((analysisStep + 1) / analysisMessages.length) * 100}%`, [analysisStep]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    try {
      const formData = new FormData(event.currentTarget);
      const params = new URLSearchParams();
      const leadData: Record<string, string> = {};

      formData.forEach((value, key) => {
        const normalizedValue = String(value).trim();
        params.set(key, normalizedValue);
        leadData[key] = normalizedValue;
      });

      const missingField = requiredFields.find((field) => !leadData[field]);
      if (missingField) {
        setFormError("请先补充所有必填信息，再生成奖学金匹配报告。");
        return;
      }

      if (!isValidEmail(leadData.email)) {
        setFormError("请填写有效的邮箱地址，方便接收报告备份。");
        return;
      }

      try {
        localStorage.setItem("scholarshipAssessmentLead", JSON.stringify(leadData));
      } catch (error) {
        console.warn("Failed to save assessment lead to localStorage", error);
      }

      trackEvent("submit_assessment", {
        targetDegree: leadData.targetDegree,
        targetCountries: leadData.targetCountries,
        scholarshipPreference: leadData.scholarshipPreference,
        needConsulting: leadData.needConsulting,
      });

      setIsAnalyzing(true);
      setAnalysisStep(0);

      analysisMessages.forEach((_, index) => {
        window.setTimeout(() => setAnalysisStep(index), index * 700);
      });

      window.setTimeout(() => {
        router.push(`/result?${params.toString()}`);
      }, 3600);
    } catch (error) {
      console.warn("Assessment submission failed", error);
      setFormError("生成报告时遇到问题，请检查信息后再试一次。");
      setIsAnalyzing(false);
    }
  }

  return (
    <PageShell>
      <section className="mx-auto max-w-4xl px-5 pb-14 pt-8">
        {isAnalyzing ? (
          <div className="rounded-[2.2rem] bg-white p-7 shadow-soft ring-1 ring-slate-100 md:p-10">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-brand-700 ring-1 ring-blue-100">AI 正在生成简版报告</span>
            <h1 className="mt-5 text-3xl font-black leading-tight text-slate-950 md:text-4xl">请稍等，我们正在完成奖学金初筛</h1>
            <p className="mt-4 text-base font-black text-brand-700">{analysisMessages[analysisStep]}</p>
            <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-brand-600 transition-all duration-500" style={{ width: progressWidth }} />
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-500">预计 3–5 秒完成。第一版使用规则匹配与 mock 数据，未来可替换为动态搜索和官网验证。</p>
          </div>
        ) : (
          <>
            <div className="mb-6 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100 md:p-8">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-brand-700 ring-1 ring-blue-100">免费测评 · 约 2 分钟</span>
              <h1 className="mt-4 text-3xl font-black leading-tight text-slate-950 md:text-4xl">填写你的留学背景，生成奖学金初筛报告</h1>
              <p className="mt-3 text-sm leading-6 text-slate-600">信息越具体，报告中的匹配评级、风险提示和下一步建议越接近真实申请判断。</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 rounded-[2.2rem] bg-white p-5 shadow-soft ring-1 ring-slate-100 md:p-8">
              <div>
                <p className="text-sm font-black text-brand-600">Step 1 / 基础申请信息</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {selectFields.map((field) => (
                    <label key={field.name} className="block">
                      <span className="text-sm font-black text-slate-800">{field.label}</span>
                      <select name={field.name} required className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-blue-50">
                        {field.options.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5">
                <p className="text-sm font-black text-brand-600">Step 2 / 成绩、预算与联系方式</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {inputFields.map((field) => (
                    <label key={field.name} className="block">
                      <span className="text-sm font-black text-slate-800">{field.label}</span>
                      <input name={field.name} type={field.type} required placeholder={field.placeholder} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-blue-50" />
                    </label>
                  ))}
                </div>
              </div>

              <label className="block border-t border-slate-100 pt-5">
                <span className="text-sm font-black text-slate-800">科研/论文/竞赛/实习经历</span>
                <textarea name="experiences" required rows={5} placeholder="请简要描述你的科研、论文、竞赛、实习、项目或公益经历" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-blue-50" />
              </label>

              {formError ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700 ring-1 ring-rose-100">{formError}</p> : null}

              <button type="submit" className="w-full rounded-2xl bg-brand-600 px-6 py-4 text-sm font-black text-white shadow-lg shadow-blue-100 transition hover:-translate-y-0.5 hover:bg-brand-700">
                生成奖学金匹配报告
              </button>
              <p className="text-center text-xs leading-5 text-slate-400">第一版为 mock 数据与规则匹配，不构成最终申请承诺；联系方式仅用于后续报告与顾问沟通。</p>
            </form>
          </>
        )}
      </section>
    </PageShell>
  );
}
