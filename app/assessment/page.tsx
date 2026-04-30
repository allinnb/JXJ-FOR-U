"use client";

import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { PageShell } from "@/components/PageShell";

const selectFields = [
  { name: "currentEducation", label: "当前学历", options: ["高中/国际高中", "本科", "硕士", "博士", "其他"] },
  { name: "targetDegree", label: "目标学历", options: ["本科", "硕士", "博士", "交换/访学"] },
  { name: "schoolBackground", label: "学校背景", options: ["985", "211", "双非", "海外院校", "国际学校", "其他"] },
  { name: "scholarshipPreference", label: "期望奖学金类型", options: ["全奖", "半奖", "学费减免", "生活补助", "都可以"] },
  { name: "acceptNonPopular", label: "是否接受非热门国家或非热门院校", options: ["是", "否"] },
  { name: "needConsulting", label: "是否需要人工申请辅导", options: ["是", "否"] },
];

const inputFields = [
  { name: "targetCountries", label: "目标国家/地区", placeholder: "如：英国、美国、加拿大、欧洲" },
  { name: "majorDirection", label: "目标专业方向", placeholder: "如：商科、计算机、教育、工程" },
  { name: "intakeTime", label: "入学时间", placeholder: "如：2026 Fall" },
  { name: "gpa", label: "GPA 或均分", placeholder: "如：3.5/4.0 或 86/100" },
  { name: "languageScore", label: "语言成绩", placeholder: "如：雅思 7.0 / 托福 100" },
  { name: "familyBudget", label: "家庭预算", placeholder: "如：低预算 / 20-30万 / 50万以上" },
  { name: "wechat", label: "微信号", placeholder: "用于顾问发送完整报告" },
  { name: "email", label: "邮箱", placeholder: "用于接收报告备份" },
];

export default function AssessmentPage() {
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();
    formData.forEach((value, key) => params.set(key, String(value)));
    router.push(`/result?${params.toString()}`);
  }

  return (
    <PageShell>
      <section className="mx-auto max-w-3xl px-5 pb-12 pt-6">
        <div className="mb-6">
          <p className="text-sm font-semibold text-brand-600">免费测评</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">填写你的留学背景</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">约 2 分钟完成，系统会生成一份奖学金方向简版报告。</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-[2rem] bg-white p-5 shadow-soft md:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {selectFields.map((field) => (
              <label key={field.name} className="block">
                <span className="text-sm font-bold text-slate-800">{field.label}</span>
                <select name={field.name} required className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-500">
                  {field.options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>
            ))}
            {inputFields.map((field) => (
              <label key={field.name} className="block">
                <span className="text-sm font-bold text-slate-800">{field.label}</span>
                <input name={field.name} required placeholder={field.placeholder} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" />
              </label>
            ))}
          </div>

          <label className="block">
            <span className="text-sm font-bold text-slate-800">科研/论文/竞赛/实习经历</span>
            <textarea name="experiences" required rows={5} placeholder="请简要描述你的科研、论文、竞赛、实习、项目或公益经历" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500" />
          </label>

          <button type="submit" className="w-full rounded-2xl bg-brand-600 px-6 py-4 text-sm font-black text-white shadow-lg shadow-blue-100 transition hover:bg-brand-700">
            生成奖学金匹配报告
          </button>
          <p className="text-center text-xs text-slate-400">第一版为 mock 数据与规则匹配，不构成最终申请承诺。</p>
        </form>
      </section>
    </PageShell>
  );
}
