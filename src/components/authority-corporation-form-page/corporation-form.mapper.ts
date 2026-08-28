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
  type MarcSubfieldReplacement,
} from "@/lib/marc/marc-field.utils";

export interface CorporationAuthorityFormValues {
  authorityType: string;
  region: string;
  heading: string;
  establishedDate: string;
  endedDate: string;
  referenceHeading: string;
  originalName: string;
  history: string;
  corporateType: string;
  place: string;
  placeDateFrom: string;
  placeDateTo: string;
  addressType: string;
  address: string;
  activityField: string;
  activityFieldDateFrom: string;
  activityFieldDateTo: string;
  relatedOrganization: string;
  relatedOrganizationDateFrom: string;
  relatedOrganizationDateTo: string;
  language: string;
  source: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export function createEmptyCorporationAuthorityFormValues(): CorporationAuthorityFormValues {
  return {
    authorityType: "110",
    region: "",
    heading: "",
    establishedDate: "",
    endedDate: "",
    referenceHeading: "",
    originalName: "",
    history: "",
    corporateType: "",
    place: "",
    placeDateFrom: "",
    placeDateTo: "",
    addressType: "",
    address: "",
    activityField: "",
    activityFieldDateFrom: "",
    activityFieldDateTo: "",
    relatedOrganization: "",
    relatedOrganizationDateFrom: "",
    relatedOrganizationDateTo: "",
    language: "",
    source: "",
    createdBy: "",
    createdAt: "",
    updatedBy: "",
    updatedAt: "",
  };
}

export function mapAuthorityDetailToCorporationFormValues(
  detail: AuthorityDetailData,
): CorporationAuthorityFormValues {
  const field110 = findMarcFieldByTag(detail.record.dataFields, "110");
  const field046 = detail.record.dataFields.find(
    (field) =>
      field.tag === "046" &&
      field.subfields.some(({ code }) => code === "s" || code === "t"),
  );
  const field665 = findMarcFieldByTag(detail.record.dataFields, "665");

  return {
    ...createEmptyCorporationAuthorityFormValues(),
    authorityType: "110",
    region: detail.acRegionCode ?? "",
    heading:
      formatCorporateName(field110?.subfields) || detail.headingName || "",
    establishedDate: getMarcSubfieldValue(field046, "s"),
    endedDate: getMarcSubfieldValue(field046, "t"),
    history: getMarcSubfieldValue(field665, "a"),
    createdBy: detail.firstWorker ?? "",
    createdAt: detail.firstInputDate ?? "",
    updatedBy: detail.lastWorker ?? "",
    updatedAt: detail.lastUpdateDate ?? "",
  };
}

export type CorporationMarcAddTarget =
  | "heading"
  | "establishmentDates"
  | "referenceHeading"
  | "originalName"
  | "history"
  | "corporateType"
  | "place"
  | "address"
  | "activityField"
  | "relatedOrganization"
  | "language"
  | "source";

const ADDRESS_SUBFIELD_CODE: Readonly<Record<string, string>> = {
  address: "a",
  phone: "a",
  email: "m",
  website: "u",
};

export function addCorporationFormValuesToMarcFields(
  fields: MarcField[],
  target: CorporationMarcAddTarget,
  values: CorporationAuthorityFormValues,
) {
  switch (target) {
    case "heading":
      return upsertDataField(
        fields,
        "110",
        splitCorporateName(values.heading),
      );
    case "establishmentDates":
      return upsertMatchingDataField(
        fields,
        "046",
        ["s", "t"],
        [
          { code: "s", value: values.establishedDate },
          { code: "t", value: values.endedDate },
        ],
      );
    case "referenceHeading":
      return appendMarcDataField(
        fields,
        createMarcDataField(
          "410",
          splitCorporateName(values.referenceHeading).map(({ code, value }) =>
            createMarcSubfield(code, value),
          ),
        ),
      );
    case "originalName":
      return appendMarcDataField(
        fields,
        createMarcDataField(
          "410",
          splitCorporateName(values.originalName).map(({ code, value }) =>
            createMarcSubfield(code, value),
          ),
        ),
      );
    case "history":
      return upsertDataField(fields, "665", [
        { code: "a", value: values.history },
      ]);
    case "corporateType":
      return appendMarcDataField(
        fields,
        createMarcDataField("368", [
          createMarcSubfield("a", values.corporateType),
        ]),
      );
    case "place":
      return appendMarcDataField(
        fields,
        createMarcDataField("370", [
          createMarcSubfield("e", values.place),
          createMarcSubfield("s", values.placeDateFrom),
          createMarcSubfield("t", values.placeDateTo),
        ]),
      );
    case "address":
      return appendMarcDataField(
        fields,
        createMarcDataField("371", [
          createMarcSubfield(
            ADDRESS_SUBFIELD_CODE[values.addressType],
            values.address,
          ),
        ]),
      );
    case "activityField":
      return appendRelatedDateField(
        fields,
        "372",
        values.activityField,
        values.activityFieldDateFrom,
        values.activityFieldDateTo,
      );
    case "relatedOrganization":
      return appendRelatedDateField(
        fields,
        "373",
        values.relatedOrganization,
        values.relatedOrganizationDateFrom,
        values.relatedOrganizationDateTo,
      );
    case "language":
      return appendMarcDataField(
        fields,
        createMarcDataField("377", [createMarcSubfield("l", values.language)]),
      );
    case "source":
      return appendMarcDataField(
        fields,
        createMarcDataField("670", [createMarcSubfield("a", values.source)]),
      );
  }
}

function appendRelatedDateField(
  fields: MarcField[],
  tag: "372" | "373",
  value: string,
  dateFrom: string,
  dateTo: string,
) {
  return appendMarcDataField(
    fields,
    createMarcDataField(tag, [
      createMarcSubfield("a", value),
      createMarcSubfield("s", dateFrom),
      createMarcSubfield("t", dateTo),
    ]),
  );
}

function upsertDataField(
  fields: MarcField[],
  tag: string,
  replacements: readonly MarcSubfieldReplacement[],
) {
  return upsertMatchingDataField(
    fields,
    tag,
    replacements.map(({ code }) => code),
    replacements,
  );
}

function upsertMatchingDataField(
  fields: MarcField[],
  tag: string,
  matchingCodes: readonly string[],
  replacements: readonly MarcSubfieldReplacement[],
) {
  const fieldIndex = fields.findIndex(
    (field) =>
      field.type === "data" &&
      field.tag === tag &&
      (tag !== "046" ||
        field.subfields.some(({ code }) => matchingCodes.includes(code))),
  );

  if (fieldIndex < 0) {
    return appendMarcDataField(
      fields,
      createMarcDataField(
        tag,
        replacements.map(({ code, value }) => createMarcSubfield(code, value)),
      ),
    );
  }

  const currentField = fields[fieldIndex];
  if (currentField.type !== "data") {
    return fields;
  }

  const nextField = replaceMarcDataFieldSubfields(currentField, replacements);
  return sortMarcFields(
    fields.flatMap((field, index): MarcField[] => {
      if (index !== fieldIndex) {
        return [field];
      }
      return nextField ? [nextField] : [];
    }),
  );
}

function splitCorporateName(value: string): MarcSubfieldReplacement[] {
  const normalizedValue = value.trim();
  if (!normalizedValue) {
    return [];
  }

  const segments = normalizedValue
    .split(/\.\s*/)
    .map((segment) => segment.trim())
    .filter(Boolean);
  if (segments.length <= 1) {
    return [{ code: "a", value: normalizedValue }];
  }

  return segments.map((segment, index) => ({
    code: index === 0 ? "a" : "b",
    value: index < segments.length - 1 ? `${segment}.` : segment,
  }));
}

function formatCorporateName(
  subfields: readonly { code: string; value: string }[] | undefined,
) {
  const nameParts =
    subfields
      ?.filter(({ code }) => code === "a" || code === "b")
      .map(({ value }) => value.trim())
      .filter(Boolean) ?? [];

  return nameParts.reduce((name, part) => {
    if (!name) {
      return part;
    }
    return name.endsWith(".") ? `${name} ${part}` : `${name}. ${part}`;
  }, "");
}
