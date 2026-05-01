import { createBitableRecord } from "@/src/lib/feishu/client";
import { FEISHU_SCHOLARSHIP_FIELDS } from "@/src/lib/feishu/fieldMap";
import { sourceReliabilityLabels, sourceTypeLabels } from "@/src/types";
import type { Scholarship } from "@/src/types";

function degreeText(value: Scholarship["degreeLevel"]) {
  return Array.isArray(value) ? value.join(" / ") : String(value);
}

export async function createScholarshipRecords(reportId: string, scholarships: Scholarship[]) {
  const results = [];

  for (const scholarship of scholarships) {
    const fields = {
      [FEISHU_SCHOLARSHIP_FIELDS.reportId]: reportId,
      [FEISHU_SCHOLARSHIP_FIELDS.name]: scholarship.name,
      [FEISHU_SCHOLARSHIP_FIELDS.country]: scholarship.country,
      [FEISHU_SCHOLARSHIP_FIELDS.institution]: scholarship.institution,
      [FEISHU_SCHOLARSHIP_FIELDS.degreeLevel]: degreeText(scholarship.degreeLevel),
      [FEISHU_SCHOLARSHIP_FIELDS.scholarshipType]: scholarship.scholarshipType,
      [FEISHU_SCHOLARSHIP_FIELDS.amount]: scholarship.amount,
      [FEISHU_SCHOLARSHIP_FIELDS.deadline]: scholarship.deadline,
      [FEISHU_SCHOLARSHIP_FIELDS.officialUrl]: scholarship.officialUrl,
      [FEISHU_SCHOLARSHIP_FIELDS.sourceType]: sourceTypeLabels[scholarship.sourceType],
      [FEISHU_SCHOLARSHIP_FIELDS.sourceReliability]: sourceReliabilityLabels[scholarship.sourceReliability],
      [FEISHU_SCHOLARSHIP_FIELDS.aiConfidence]: String(scholarship.aiConfidence),
      [FEISHU_SCHOLARSHIP_FIELDS.matchReason]: scholarship.matchReason,
      [FEISHU_SCHOLARSHIP_FIELDS.risks]: scholarship.risks,
      [FEISHU_SCHOLARSHIP_FIELDS.requiresHumanReview]: scholarship.requiresHumanReview ? "是" : "否",
      [FEISHU_SCHOLARSHIP_FIELDS.advisorDecision]: scholarship.advisorReview?.advisorDecision || "unsure",
      [FEISHU_SCHOLARSHIP_FIELDS.advisorPriority]: scholarship.advisorReview?.advisorPriority || "medium",
      [FEISHU_SCHOLARSHIP_FIELDS.advisorNote]: scholarship.advisorReview?.advisorNote || "",
    };

    results.push(await createBitableRecord("scholarships", fields));
  }

  return results;
}
