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

export interface GeographyAuthorityFormValues {
  authorityType: string;
  region: string;
  heading: string;
  referenceHeading: string;
  source: string;
  note: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export function createEmptyGeographyAuthorityFormValues(): GeographyAuthorityFormValues {
  return {
    authorityType: "151",
    region: "",
    heading: "",
    referenceHeading: "",
    source: "",
    note: "",
    createdBy: "",
    createdAt: "",
    updatedBy: "",
    updatedAt: "",
  };
}

export function mapAuthorityDetailToGeographyFormValues(
  detail: AuthorityDetailData,
): GeographyAuthorityFormValues {
  const field151 = findMarcFieldByTag(detail.record.dataFields, "151");
  // 반복 가능 필드는 오른쪽 MARC 에디터에서 기존 행을 관리한다.
  // 왼쪽 입력은 새 행을 추가하는 draft이므로 상세값으로 채우지 않는다.
  return {
    ...createEmptyGeographyAuthorityFormValues(),
    region: detail.acRegionCode ?? "",
    heading: getMarcSubfieldValue(field151, "a") || detail.headingName || "",
    createdBy: detail.firstWorker ?? "",
    createdAt: detail.firstInputDate ?? "",
    updatedBy: detail.lastWorker ?? "",
    updatedAt: detail.lastUpdateDate ?? "",
  };
}

export type GeographyMarcAddTarget =
  | "heading"
  | "referenceHeading"
  | "source"
  | "note";

export function addGeographyFormValuesToMarcFields(
  fields: MarcField[],
  target: GeographyMarcAddTarget,
  values: GeographyAuthorityFormValues,
) {
  switch (target) {
    case "heading":
      return upsertDataField(fields, "151", "a", values.heading);
    case "referenceHeading":
      return appendMarcDataField(
        fields,
        createMarcDataField("451", [
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
        createMarcDataField("680", [createMarcSubfield("i", values.note)]),
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
