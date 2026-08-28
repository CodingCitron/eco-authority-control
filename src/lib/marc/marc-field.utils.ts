import {
  getFieldRule,
  type DataFieldRule,
  type FieldRule,
  type SubfieldRule,
} from "marc-eco";

import type {
  MarcDataField,
  MarcField,
  SubField,
} from "@/types/marc-editor.types";

type FieldWithSubfields = {
  tag: string;
  subfields: readonly SubField[];
};

export interface MarcSubfieldReplacement {
  code: string;
  value: string;
}

/** 제어 필드 규칙과 데이터 필드 규칙을 구분한다. */
function isDataFieldRule(
  rule: FieldRule | undefined,
): rule is DataFieldRule {
  return Boolean(rule && !("length" in rule) && !("positions" in rule));
}

export function getMarcDataFieldRule(tag: string) {
  const rule = getFieldRule(tag);
  return isDataFieldRule(rule) ? rule : undefined;
}

export function getMarcSubfieldRule(
  tag: string,
  code: string,
): SubfieldRule | undefined {
  return getMarcDataFieldRule(tag)?.subfields?.[code];
}

/** marc-eco 규칙에 등록된 필드가 반복 가능한지 반환한다. */
export function isMarcFieldRepeatable(tag: string) {
  return getFieldRule(tag)?.repeatable === true;
}

/** marc-eco 규칙에 등록된 서브필드가 반복 가능한지 반환한다. */
export function isMarcSubfieldRepeatable(tag: string, code: string) {
  return getMarcSubfieldRule(tag, code)?.repeatable === true;
}

/** 태그 오름차순으로 정렬하되, 아직 태그를 입력하지 않은 새 행은 마지막에 둔다. */
export function sortMarcFields(fields: MarcField[]) {
  return [...fields].sort((left, right) => {
    if (!left.tag) {
      return right.tag ? 1 : 0;
    }
    if (!right.tag) {
      return -1;
    }

    return left.tag.localeCompare(right.tag);
  });
}

/** marc-eco가 정의한 태그별 order에 따라 서브필드를 안정적으로 정렬한다. */
export function sortMarcSubfields(tag: string, subfields: SubField[]) {
  const rules = getMarcDataFieldRule(tag)?.subfields;

  return subfields
    .map((subfield, index) => ({ subfield, index }))
    .sort((left, right) => {
      const leftOrder = rules?.[left.subfield.code]?.order;
      const rightOrder = rules?.[right.subfield.code]?.order;

      return (
        (leftOrder ?? Number.MAX_SAFE_INTEGER) -
          (rightOrder ?? Number.MAX_SAFE_INTEGER) ||
        left.index - right.index
      );
    })
    .map(({ subfield }) => subfield);
}

/** 빈 코드나 빈 값은 MARC 서브필드로 만들지 않는다. */
export function createMarcSubfield(
  code: string | undefined,
  value: string,
): SubField | undefined {
  const normalizedCode = code?.trim();
  const normalizedValue = value.trim();

  return normalizedCode && normalizedValue
    ? { code: normalizedCode, value: normalizedValue }
    : undefined;
}

/**
 * 데이터 필드를 만들면서 빈 서브필드를 제거하고 marc-eco의 순서 및 반복 규칙을 적용한다.
 * 규칙에 없는 서브필드는 손실하지 않고 입력 순서를 유지한다.
 */
export function createMarcDataField(
  tag: string,
  subfields: Array<SubField | undefined>,
  indicator1 = " ",
  indicator2 = " ",
): MarcDataField | undefined {
  const seenNonRepeatableCodes = new Set<string>();
  const normalizedSubfields = subfields.filter(
    (subfield): subfield is SubField => {
      if (!subfield) {
        return false;
      }

      const rule = getMarcSubfieldRule(tag, subfield.code);
      if (!rule || rule.repeatable === true) {
        return true;
      }
      if (seenNonRepeatableCodes.has(subfield.code)) {
        return false;
      }

      seenNonRepeatableCodes.add(subfield.code);
      return true;
    },
  );

  if (normalizedSubfields.length === 0) {
    return undefined;
  }

  const subfieldRules = getMarcDataFieldRule(tag)?.subfields;
  const isMissingRequiredSubfield = Object.entries(subfieldRules ?? {}).some(
    ([code, rule]) =>
      rule.required === true &&
      !normalizedSubfields.some((subfield) => subfield.code === code),
  );
  if (isMissingRequiredSubfield) {
    return undefined;
  }

  return {
    type: "data",
    tag,
    indicator1,
    indicator2,
    subfields: sortMarcSubfields(tag, normalizedSubfields),
  };
}

/**
 * 기존 데이터 필드에서 지정한 서브필드를 교체한다. 빈 replacement는 해당
 * 서브필드를 삭제하며, 결과가 비거나 필수 서브필드가 사라지면 필드도 삭제한다.
 */
export function replaceMarcDataFieldSubfields(
  field: MarcDataField,
  replacements: readonly MarcSubfieldReplacement[],
): MarcDataField | undefined {
  const replacedCodes = new Set(replacements.map(({ code }) => code));
  const replacementSubfields = replacements.map(({ code, value }) =>
    createMarcSubfield(code, value),
  );

  return createMarcDataField(
    field.tag,
    [
      ...field.subfields.filter(({ code }) => !replacedCodes.has(code)),
      ...replacementSubfields,
    ],
    field.indicator1,
    field.indicator2,
  );
}

/**
 * 데이터 필드를 추가한다. marc-eco에서 반복 가능으로 정의한 태그는 같은
 * 내용이어도 새 행을 추가하고, 비반복 태그가 이미 있으면 추가하지 않는다.
 * 규칙에 없는 태그는 편집기에서 손실되지 않도록 추가를 허용한다.
 */
export function appendMarcDataField(
  fields: MarcField[],
  nextField: MarcDataField | undefined,
) {
  if (!nextField) {
    return fields;
  }

  const rule = getFieldRule(nextField.tag);
  const hasSameTag = fields.some((field) => field.tag === nextField.tag);
  if (rule && rule.repeatable !== true && hasSameTag) {
    return fields;
  }

  return sortMarcFields([...fields, nextField]);
}

export function findMarcFieldByTag<T extends { tag: string }>(
  fields: readonly T[],
  tag: string,
) {
  return fields.find((field) => field.tag === tag);
}

export function getMarcSubfieldValue(
  field: FieldWithSubfields | undefined,
  code: string,
) {
  return field?.subfields.find((subfield) => subfield.code === code)?.value ?? "";
}

export function getMarcSubfieldValueFromFields(
  fields: readonly FieldWithSubfields[],
  code: string,
) {
  return (
    fields
      .map((field) => getMarcSubfieldValue(field, code))
      .find(Boolean) ?? ""
  );
}
