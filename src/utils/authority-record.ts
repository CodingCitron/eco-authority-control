import type { AuthorityDetailData } from "@/types/authority-detail.types";
import type { AuthorityRecord } from "@/types/authority-search.types";
import {
  isValidAcType,
  type AuthoritySearchType,
} from "@/types/authority.types";

export const authorityHeadingTags: Record<AuthoritySearchType, string> = {
  "0": "100",
  "1": "110",
  "5": "151",
  "4": "150",
};

export function getAuthorityHeading(record?: AuthorityRecord) {
  if (!record) {
    return "";
  }

  const headingName = record.headingName?.trim();
  if (headingName) {
    return headingName;
  }

  if ("activityField" in record) {
    return record.activityField?.trim() ?? "";
  }

  return "";
}

export function getAuthorityHeadingTag(acType?: string | null) {
  return isValidAcType(acType) ? authorityHeadingTags[acType] : undefined;
}

export function getMarcAuthorityHeading(
  record: AuthorityDetailData["record"] | undefined,
  acType?: string | null,
) {
  const headingTag = getAuthorityHeadingTag(acType);
  if (!record || !headingTag) {
    return "";
  }

  const headingField = record.dataFields.find(
    (field) => field.tag === headingTag,
  );

  return (
    headingField?.subfields
      .filter(({ code }) => code !== "0" && code !== "w")
      .map(({ value }) => value.trim())
      .filter(Boolean)
      .join(" ") ?? ""
  );
}
