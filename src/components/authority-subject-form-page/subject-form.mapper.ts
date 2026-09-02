import type { AuthorityDetailData } from "@/types/authority-detail.types";
import type { MarcField } from "@/types/marc-editor.types";
import {
  appendMarcDataField,
  createMarcDataField,
  createMarcSubfield,
  findMarcFieldByTag,
  getMarcSubfieldValue,
  replaceMarcDataFieldSubfields,
  sortMarcFields,
} from "@/lib/marc/marc-field.utils";

export type SubjectReferenceRelationCode = "" | "r";

export interface SubjectAuthorityFormValues {
  authorityType: string;
  region: string;
  heading: string;
  referenceRelationCode: SubjectReferenceRelationCode;
  referenceLanguage: string;
  referenceHeading: string;
  source: string;
  note: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export function createEmptySubjectAuthorityFormValues(): SubjectAuthorityFormValues {
  return {
    authorityType: "150",
    region: "",
    heading: "",
    referenceRelationCode: "",
    referenceLanguage: "",
    referenceHeading: "",
    source: "",
    note: "",
    createdBy: "",
    createdAt: "",
    updatedBy: "",
    updatedAt: "",
  };
}

export function mapAuthorityDetailToSubjectFormValues(
  detail: AuthorityDetailData,
): SubjectAuthorityFormValues {
  const field150 = findMarcFieldByTag(detail.record.dataFields, "150");

  // 반복 가능 필드는 오른쪽 MARC 에디터에서 기존 행을 관리한다.
  // 왼쪽 입력은 새 행을 추가하는 draft이므로 상세값으로 채우지 않는다.
  return {
    ...createEmptySubjectAuthorityFormValues(),
    region: detail.acRegionCode ?? "",
    heading: getMarcSubfieldValue(field150, "a") || detail.headingName || "",
    createdBy: detail.firstWorker ?? "",
    createdAt: detail.firstInputDate ?? "",
    updatedBy: detail.lastWorker ?? "",
    updatedAt: detail.lastUpdateDate ?? "",
  };
}

export type SubjectMarcAddTarget =
  | "heading"
  | "referenceHeading"
  | "source"
  | "note";

export function addSubjectFormValuesToMarcFields(
  fields: MarcField[],
  target: SubjectMarcAddTarget,
  values: SubjectAuthorityFormValues,
) {
  switch (target) {
    case "heading":
      return upsertDataField(fields, "150", "a", values.heading);
    case "referenceHeading":
      return appendMarcDataField(
        fields,
        createMarcDataField("450", [
          createMarcSubfield("w", values.referenceRelationCode),
          createMarcSubfield("i", values.referenceLanguage),
          createMarcSubfield("a", values.referenceHeading),
        ]),
      );
    case "source":
      return appendMarcDataField(
        fields,
        createMarcDataField("670", [createMarcSubfield("a", values.source)]),
      );
    case "note":
      return appendMarcDataField(
        fields,
        createMarcDataField("680", [createMarcSubfield("a", values.note)]),
      );
  }
}

function upsertDataField(
  fields: MarcField[],
  tag: string,
  code: string,
  value: string,
) {
  const fieldIndex = fields.findIndex(
    (field) => field.type === "data" && field.tag === tag,
  );

  if (fieldIndex < 0) {
    return appendMarcDataField(
      fields,
      createMarcDataField(tag, [createMarcSubfield(code, value)]),
    );
  }

  const currentField = fields[fieldIndex];
  if (currentField.type !== "data") {
    return fields;
  }

  const nextField = replaceMarcDataFieldSubfields(currentField, [
    { code, value },
  ]);

  return sortMarcFields(
    fields.flatMap((field, index): MarcField[] => {
      if (index !== fieldIndex) {
        return [field];
      }
      return nextField ? [nextField] : [];
    }),
  );
}
