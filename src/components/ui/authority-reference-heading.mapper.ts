import {
  createMarcDataField,
  createMarcSubfield,
} from "@/lib/marc/marc-field.utils";
import type { AuthorityDataField } from "@/types/authority-detail.types";
import type { MarcDataField } from "@/types/marc-editor.types";

export type AuthorityReferenceRelationCode = "" | "a" | "b" | "g" | "h";

/** 기존 510을 복사하면서 사용자가 선택한 관계 코드($w)를 적용한다. */
export function copyAuthorityReferenceField(
  field: AuthorityDataField,
  relationCode: AuthorityReferenceRelationCode,
): MarcDataField | undefined {
  if (field.tag !== "510") {
    return undefined;
  }

  return createMarcDataField(
    field.tag,
    [
      createMarcSubfield("w", relationCode),
      ...field.subfields.filter(({ code }) => code !== "w"),
    ],
    field.ind1,
    field.ind2,
  );
}
