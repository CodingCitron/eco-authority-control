import type {
  AuthorityRow,
  GeographyRow,
  OrganizationRow,
  SubjectRow,
} from "@/components/home/search-result.types";
import { authoritySearchMockData } from "./authority-search.mock";

export type AuthoritySearchType =
  | "personal"
  | "organization"
  | "geography"
  | "subject";

export interface AuthoritySearchParams {
  type?: AuthoritySearchType;
  nationality?: string;
  controlNumber?: string;
  heading?: string;
}

export type AuthoritySearchResult =
  | AuthorityRow
  | OrganizationRow
  | GeographyRow
  | SubjectRow;

export async function fetchAuthoritySearchResults(
  params: AuthoritySearchParams,
): Promise<AuthoritySearchResult[]> {
  return authoritySearchMockData.filter(
    (row) =>
      (!params.type || row.type === authorityTypeLabels[params.type]) &&
      (!params.nationality || row.nationality === params.nationality) &&
      (!params.controlNumber ||
        row.controlNumber.includes(params.controlNumber)) &&
      (!params.heading || row.heading.includes(params.heading)),
  );
}

const authorityTypeLabels: Record<AuthoritySearchType, string> = {
  personal: "개인명",
  organization: "단체명",
  geography: "지리명",
  subject: "주제명",
};
