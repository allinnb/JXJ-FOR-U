import { createBitableRecord } from "@/src/lib/feishu/client";
import { FEISHU_LEADS_FIELDS } from "@/src/lib/feishu/fieldMap";
import { matchLevelLabels } from "@/src/types";
import type { LeadRecord } from "@/src/types";

function text(value: unknown) {
  if (Array.isArray(value)) return value.join("\n");
  if (value === null || value === undefined) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export async function createLeadRecord(leadRecord: LeadRecord) {
  const { userProfile, matchResult } = leadRecord;
  const fields = {
    [FEISHU_LEADS_FIELDS.reportId]: leadRecord.reportId,
    [FEISHU_LEADS_FIELDS.createdAt]: leadRecord.createdAt,
    [FEISHU_LEADS_FIELDS.wechat]: userProfile.wechat,
    [FEISHU_LEADS_FIELDS.email]: userProfile.email,
    [FEISHU_LEADS_FIELDS.currentEducation]: userProfile.currentEducation,
    [FEISHU_LEADS_FIELDS.targetDegree]: userProfile.targetDegree,
    [FEISHU_LEADS_FIELDS.targetCountry]: userProfile.targetCountry,
    [FEISHU_LEADS_FIELDS.targetMajor]: userProfile.targetMajor,
    [FEISHU_LEADS_FIELDS.intakeTime]: userProfile.intakeTime,
    [FEISHU_LEADS_FIELDS.schoolBackground]: userProfile.schoolBackground,
    [FEISHU_LEADS_FIELDS.gpa]: userProfile.gpa,
    [FEISHU_LEADS_FIELDS.languageScore]: userProfile.languageScore,
    [FEISHU_LEADS_FIELDS.experiences]: userProfile.experiences,
    [FEISHU_LEADS_FIELDS.budget]: userProfile.budget,
    [FEISHU_LEADS_FIELDS.scholarshipPreference]: userProfile.scholarshipPreference,
    [FEISHU_LEADS_FIELDS.acceptsNonPopular]: userProfile.acceptsNonPopular,
    [FEISHU_LEADS_FIELDS.needsConsulting]: userProfile.needsConsulting,
    [FEISHU_LEADS_FIELDS.matchLevel]: matchLevelLabels[matchResult.matchLevel],
    [FEISHU_LEADS_FIELDS.matchScore]: text(matchResult.matchScore),
    [FEISHU_LEADS_FIELDS.leadQuality]: matchResult.leadQuality,
    [FEISHU_LEADS_FIELDS.reportStatus]: leadRecord.reportStatus,
    [FEISHU_LEADS_FIELDS.followupStatus]: leadRecord.followupStatus,
    [FEISHU_LEADS_FIELDS.risks]: text(matchResult.risks),
    [FEISHU_LEADS_FIELDS.nextSteps]: text(matchResult.nextSteps),
    [FEISHU_LEADS_FIELDS.consultantNotes]: leadRecord.consultantNotes,
  };

  return createBitableRecord("leads", fields);
}
