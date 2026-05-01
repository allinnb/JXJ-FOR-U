"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { CONSULTANT_WECHAT, STORAGE_KEYS, TRUST_DISCLAIMER } from "@/src/lib/config";
import { trackEvent } from "@/src/lib/analytics";
import { matchScholarships } from "@/src/lib/matcher";
import type { FeishuSyncStatus, UserProfile } from "@/src/types";

const STEP_LABELS = ["申请目标", "背景实力", "预算与服务"];

const goalSelectFields = [
  { name: "currentEducation", label: "当前学历", options: ["高中/国际高中", "本科", "硕士", "博士", "其他"] },
  { name: "targetDegree", label: "目标学历", options: ["本科", "硕士", "博士", "交换/访学"] },
];

const goalInputFields = [
  { name: "targetCountry", label: "目标国家/地区", placeholder: "如：英国、美国、加拿大、欧洲", type: "text" },
  { name: "targetMajor", label: "目标专业方向", placeholder: "如：商科、计算机、教育、工程", type: "text" },
  { name: "intakeTime", label: "入学时间", placeholder: "如：2026 Fall", type: "text" },
];

const backgroundSelectFields = [{ name: "schoolBackground", label: "学校背景", options: ["985", "211", "双非", "海外院校", "国际学校", "其他"] }];

const backgroundInputFields = [
  { name: "gpa", label: "GPA 或均分", placeholder: "如：3.5/4.0 或 86/100（请注明制式）", type: "text" },
  { name: "languageScore", label: "语言成绩", placeholder: "如：雅思 7.0 / 托福 100 / 多邻国 120", type: "text" },
];

const serviceSelectFields = [
  { name: "scholarshipPreference", label: "期望奖学金类型", options: ["全奖", "半奖", "学费减免", "生活补助", "都可以"] },
  { name: "acceptsNonPopular", label: "是否接受非热门国家或非热门院校", options: ["是", "否"] },
  { name: "needsConsulting", label: "是否需要人工申请辅导", options: ["是", "否"] },
];

const serviceInputFields = [
  { name: "budget", label: "家庭预算", placeholder: "如：低预算 / 20-30万 / 50万以上", type: "text" },
  { name: "email", label: "邮箱", placeholder: "用于接收报告备份", type: "email" },
  { name: "wechat", label: "微信号（选填）", placeholder: "填写后便于顾问发送人工复核建议", type: "text", optional: true },
];

const analysisMessages = ["正在分析你的学术背景", "正在生成目标国家搜索策略", "正在匹配适合的奖学金类型", "正在评估申请难度与风险", "正在生成简版报告"];

// Fields per step for validation
const stepRequiredFields: string[][] = [
  [...goalSelectFields.map((f) => f.name), ...goalInputFields.map((f) => f.name)],
  [...backgroundSelectFields.map((f) => f.name), ...backgroundInputFields.map((f) => f.name), "experiences"],
  [...serviceSelectFields.map((f) => f.name), ...serviceInputFields.filter((f) => !f.optional).map((f) => f.name)],
];

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function FieldInput({ field }: { field: { name: string; label: string; placeholder: string; type: string; optional?: boolean } }) {
  return (
    <label className="block">
      <span className="text-sm font-black text-slate-800">
        {field.label}
        {field.optional ? <span className="ml-1 text-xs font-normal text-slate-400">（选填）</span> : null}
      </span>
      <input name={field.name} type={field.type} required={!field.optional} placeholder={field.placeholder} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-blue-50" />
      {field.name === "wechat" ? <p className="mt-2 text-xs leading-5 text-slate-500">填写微信后，顾问可根据报告提供人工复核建议。不填写也可以查看简版报告。</p> : null}
    </label>
  );
}

function FieldSelect({ field }: { field: { name: string; label: string; options: string[] } }) {
  return (
    <label className="block">
      <span className="text-sm font-black text-slate-800">{field.label}</span>
      <select name={field.name} required className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-blue-50">
        <option value="">请选择</option>
        {field.options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function StepProgress({ currentStep }: { currentStep: number }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        {STEP_LABELS.map((label, index) => (
          <div key={label} className="flex flex-1 flex-col items-center gap-1.5">
            <div className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-black transition ${index < currentStep ? "bg-brand-600 text-white" : index === currentStep ? "bg-brand-600 text-white ring-4 ring-blue-100" : "bg-slate-100 text-slate-400"}`}>
              {index < currentStep ? "✓" : index + 1}
            </div>
            <span className={`text-xs font-bold ${index === currentStep ? "text-brand-700" : index < currentStep ? "text-slate-700" : "text-slate-400"}`}>{label}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-brand-600 transition-all duration-500" style={{ width: `${((currentStep + 1) / STEP_LABELS.length) * 100}%` }} />
      </div>
    </div>
  );
}

function readProfile(formData: FormData): UserProfile {
  const read = (key: keyof UserProfile) => String(formData.get(key) || "").trim();
  return {
    currentEducation: (read("currentEducation") || "本科") as UserProfile["currentEducation"],
    targetDegree: (read("targetDegree") || "硕士") as UserProfile["targetDegree"],
    targetCountry: read("targetCountry"),
    targetMajor: read("targetMajor"),
    intakeTime: read("intakeTime"),
    schoolBackground: (read("schoolBackground") || "其他") as UserProfile["schoolBackground"],
    gpa: read("gpa"),
    languageScore: read("languageScore"),
    experiences: read("experiences"),
    budget: read("budget"),
    scholarshipPreference: (read("scholarshipPreference") || "都可以") as UserProfile["scholarshipPreference"],
    acceptsNonPopular: (read("acceptsNonPopular") || "是") as UserProfile["acceptsNonPopular"],
    needsConsulting: (read("needsConsulting") || "否") as UserProfile["needsConsulting"],
    wechat: read("wechat"),
    email: read("email"),
  };
}

export default function AssessmentPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [formError, setFormError] = useState("");

  const progressWidth = useMemo(() => `${((analysisStep + 1) / analysisMessages.length) * 100}%`, [analysisStep]);

  function validateCurrentStep(formEl: HTMLFormElement): boolean {
    const formData = new FormData(formEl);
    const fields = stepRequiredFields[currentStep];
    const missingField = fields.find((field) => !String(formData.get(field) || "").trim());
    if (missingField) {
      setFormError("请先补充当前步骤的所有必填信息。");
      return false;
    }
    // Special email validation for step 2 (which is actually step 3 index=2)
    if (currentStep === 2) {
      const email = String(formData.get("email") || "").trim();
      if (email && !isValidEmail(email)) {
        setFormError("请填写有效的邮箱地址，方便接收报告备份。");
        return false;
      }
    }
    setFormError("");
    return true;
  }

  function handleNext() {
    const form = document.getElementById("assessment-form") as HTMLFormElement | null;
    if (!form) return;
    if (validateCurrentStep(form)) {
      setCurrentStep((prev) => Math.min(prev + 1, 2));
    }
  }

  function handleBack() {
    setFormError("");
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }

  async function syncLead(userProfile: UserProfile, matchResult: ReturnType<typeof matchScholarships>) {
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userProfile, matchResult }),
      });
      const data = (await response.json()) as FeishuSyncStatus;
      localStorage.setItem(STORAGE_KEYS.feishuSyncStatus, JSON.stringify({ ...data, status: data.success ? "success" : "failed", syncedAt: new Date().toISOString() }));
      if (!data.success) console.warn("Feishu sync failed", data.error);
    } catch (error) {
      console.warn("Feishu sync request failed", error);
      localStorage.setItem(
        STORAGE_KEYS.feishuSyncStatus,
        JSON.stringify({ success: false, status: "failed" as const, error: "后台同步失败", syncedAt: new Date().toISOString() } satisfies FeishuSyncStatus),
      );
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    try {
      const formData = new FormData(event.currentTarget);
      const profile = readProfile(formData);

      // Full validation
      if (!isValidEmail(profile.email)) {
        setFormError("请填写有效的邮箱地址，方便接收报告备份。");
        return;
      }

      const allRequired = [...stepRequiredFields[0], ...stepRequiredFields[1], ...stepRequiredFields[2]];
      const values = Object.fromEntries(formData.entries());
      const missingField = allRequired.find((field) => !String(values[field] || "").trim());
      if (missingField) {
        setFormError("请先补充所有必填信息，再生成奖学金匹配报告。");
        return;
      }

      const matchResult = matchScholarships(profile);

      try {
        localStorage.setItem(STORAGE_KEYS.userProfile, JSON.stringify(profile));
        localStorage.setItem(STORAGE_KEYS.matchResult, JSON.stringify(matchResult));
        localStorage.setItem(STORAGE_KEYS.legacyLead, JSON.stringify(profile));
        localStorage.setItem(STORAGE_KEYS.feishuSyncStatus, JSON.stringify({ success: false, status: "pending" as const, error: "后台同步中", syncedAt: new Date().toISOString() } satisfies FeishuSyncStatus));
      } catch (error) {
        console.warn("Failed to save assessment data to localStorage", error);
      }

      trackEvent("submit_assessment", {
        reportId: matchResult.reportId,
        targetDegree: profile.targetDegree,
        targetCountry: profile.targetCountry,
        scholarshipPreference: profile.scholarshipPreference,
        needsConsulting: profile.needsConsulting,
      });

      setIsAnalyzing(true);
      setAnalysisStep(0);
      void syncLead(profile, matchResult);

      analysisMessages.forEach((_, index) => {
        window.setTimeout(() => setAnalysisStep(index), index * 700);
      });

      window.setTimeout(() => {
        router.push(`/result?reportId=${encodeURIComponent(matchResult.reportId)}`);
      }, 3600);
    } catch (error) {
      console.warn("Assessment submission failed", error);
      setFormError(`生成报告时遇到问题，请检查信息后再试一次，或添加顾问微信 ${CONSULTANT_WECHAT}。`);
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
            <p className="mt-4 text-sm leading-6 text-slate-500">预计 3–5 秒完成。当前先生成规则初筛报告，同时尝试同步到飞书顾问工作台。</p>
          </div>
        ) : (
          <>
            <div className="mb-6 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100 md:p-8">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-brand-700 ring-1 ring-blue-100">免费测评 · 约 2 分钟</span>
              <h1 className="mt-4 text-3xl font-black leading-tight text-slate-950 md:text-4xl">像做一次咨询前测评一样，填写你的申请背景</h1>
              <p className="mt-3 text-sm leading-6 text-slate-600">提交后你会立即看到简版报告；顾问可在飞书工作台查看资料、复核机会并记录跟进状态。</p>
            </div>

            <form id="assessment-form" onSubmit={handleSubmit} className="space-y-5 rounded-[2.2rem] bg-white p-5 shadow-soft ring-1 ring-slate-100 md:p-8">
              <StepProgress currentStep={currentStep} />

              {/* Step 1: 申请目标 */}
              <section className={`rounded-[1.7rem] bg-slate-50 p-4 ring-1 ring-slate-100 md:p-5 ${currentStep !== 0 ? "hidden" : ""}`}>
                <p className="text-sm font-black text-brand-600">Step 1：申请目标</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">告诉我们你想去哪里、读什么阶段和专业，用于生成目标国家搜索策略。</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {goalSelectFields.map((field) => <FieldSelect key={field.name} field={field} />)}
                  {goalInputFields.map((field) => <FieldInput key={field.name} field={field} />)}
                </div>
              </section>

              {/* Step 2: 背景实力 */}
              <section className={`rounded-[1.7rem] bg-slate-50 p-4 ring-1 ring-slate-100 md:p-5 ${currentStep !== 1 ? "hidden" : ""}`}>
                <p className="text-sm font-black text-brand-600">Step 2：背景实力</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">GPA、语言和经历会影响奖学金竞争力，也决定哪些项目值得人工重点复核。</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {backgroundSelectFields.map((field) => <FieldSelect key={field.name} field={field} />)}
                  {backgroundInputFields.map((field) => <FieldInput key={field.name} field={field} />)}
                </div>
                <label className="mt-4 block">
                  <span className="text-sm font-black text-slate-800">科研/论文/竞赛/实习经历</span>
                  <textarea name="experiences" required rows={5} placeholder="如：一篇 SCI 论文（二作）、一段券商实习、校级数学竞赛一等奖、学生会主席经历等" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-blue-50" />
                </label>
              </section>

              {/* Step 3: 预算与服务 */}
              <section className={`rounded-[1.7rem] bg-slate-50 p-4 ring-1 ring-slate-100 md:p-5 ${currentStep !== 2 ? "hidden" : ""}`}>
                <p className="text-sm font-black text-brand-600">Step 3：预算与服务需求</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">预算和服务偏好会帮助判断是先看完整 AI 报告，还是直接做人工复核策略。</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {serviceSelectFields.map((field) => <FieldSelect key={field.name} field={field} />)}
                  {serviceInputFields.map((field) => <FieldInput key={field.name} field={field} />)}
                </div>
              </section>

              {formError ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700 ring-1 ring-rose-100">{formError}</p> : null}

              <div className="flex gap-3">
                {currentStep > 0 ? (
                  <button type="button" onClick={handleBack} className="flex-1 rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-black text-slate-800 transition hover:border-brand-200 hover:text-brand-700">
                    上一步
                  </button>
                ) : null}
                {currentStep < 2 ? (
                  <button type="button" onClick={handleNext} className="flex-1 rounded-2xl bg-brand-600 px-6 py-4 text-sm font-black text-white shadow-lg shadow-blue-100 transition hover:-translate-y-0.5 hover:bg-brand-700">
                    下一步
                  </button>
                ) : (
                  <button type="submit" className="flex-1 rounded-2xl bg-brand-600 px-6 py-4 text-sm font-black text-white shadow-lg shadow-blue-100 transition hover:-translate-y-0.5 hover:bg-brand-700">
                    生成奖学金匹配报告
                  </button>
                )}
              </div>
              <p className="text-center text-xs leading-5 text-slate-400">{TRUST_DISCLAIMER}</p>
            </form>
          </>
        )}
      </section>
    </PageShell>
  );
}
