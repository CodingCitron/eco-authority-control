import {
  createMarcDataField,
  createMarcSubfield,
} from "@/lib/marc/marc-field.utils";
import type { AuthorityDetailData } from "@/types/authority-detail.types";
import type { AuthoritySearchType } from "@/types/authority.types";
import type { MarcDataField } from "@/types/marc-editor.types";
import { authorityHeadingTags } from "@/utils/authority-record";

export type AuthorityReferenceRelationCode = "" | "a" | "b" | "g" | "h";
export type AuthorityReferenceFieldTag = "500" | "510" | "550" | "551";

/** 검색 전거의 채택표목(1XX)을 현재 편집 전거용 5XX로 만든다. */
export function create5XXReferenceFields(
  sourceAuthorityType: AuthoritySearchType,
  record: AuthorityDetailData["record"] | undefined,
  relationCode: AuthorityReferenceRelationCode,
  referenceTag: AuthorityReferenceFieldTag,
): MarcDataField[] {
  if (!record) {
    return [];
  }

  const headingTag = authorityHeadingTags[sourceAuthorityType];
  const controlNumber = record.controlFields.find(
    (field) => field.tag === "001",
  )?.value;

  return record.dataFields.flatMap((field) => {
    if (field.tag !== headingTag) {
      return [];
    }

    const referenceField = createMarcDataField(
      referenceTag,
      [
        createMarcSubfield("w", relationCode),
        ...field.subfields.filter(
          ({ code }) => code !== "w" && code !== "0",
        ),
        createMarcSubfield("0", controlNumber ?? ""),
      ],
      referenceTag === "500" && sourceAuthorityType === "0"
        ? field.ind1
        : " ",
      " ",
    );

    return referenceField ? [referenceField] : [];
  });
}
