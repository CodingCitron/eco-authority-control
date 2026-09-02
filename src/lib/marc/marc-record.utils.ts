import type {
  MarcEditorRecord,
  MarcField,
} from "@/types/marc-editor.types";

/** 화면 편집용 MARC 필드를 API와 marc-eco가 사용하는 레코드 구조로 변환한다. */
export function buildMarcRecord(fields: readonly MarcField[]): MarcEditorRecord {
  return {
    controlFields: fields.flatMap((field) =>
      field.type === "control" ? [{ tag: field.tag, value: field.value }] : [],
    ),
    dataFields: fields.flatMap((field) =>
      field.type === "data"
        ? [
            {
              tag: field.tag,
              ind1: field.indicator1,
              ind2: field.indicator2,
              subfields: field.subfields,
            },
          ]
        : [],
    ),
  };
}
