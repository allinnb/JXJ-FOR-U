import { createBitableRecord } from "@/src/lib/feishu/client";
import { FEISHU_AI_RUN_FIELDS } from "@/src/lib/feishu/fieldMap";
import type { AIRunRecord } from "@/src/types";

export async function createAIRunRecord(aiRunRecord: AIRunRecord) {
  const fields = {
    [FEISHU_AI_RUN_FIELDS.runId]: aiRunRecord.runId,
    [FEISHU_AI_RUN_FIELDS.reportId]: aiRunRecord.reportId,
    [FEISHU_AI_RUN_FIELDS.createdAt]: aiRunRecord.createdAt,
    [FEISHU_AI_RUN_FIELDS.runType]: aiRunRecord.runType,
    [FEISHU_AI_RUN_FIELDS.modelFast]: aiRunRecord.modelFast,
    [FEISHU_AI_RUN_FIELDS.modelStrong]: aiRunRecord.modelStrong,
    [FEISHU_AI_RUN_FIELDS.exaSearchCount]: String(aiRunRecord.exaSearchCount),
    [FEISHU_AI_RUN_FIELDS.processedUrlCount]: String(aiRunRecord.processedUrlCount),
    [FEISHU_AI_RUN_FIELDS.success]: aiRunRecord.success ? "是" : "否",
    [FEISHU_AI_RUN_FIELDS.errorMessage]: aiRunRecord.errorMessage,
  };

  return createBitableRecord("aiRuns", fields);
}
