import { http, HttpResponse } from "msw";

import {
  authorityTypeLabels,
  type AuthoritySearchType,
} from "@/api/authority-search";
import { authoritySearchMockData } from "@/mocks/api/authority-search.mock";

const authoritySearchPath = new URL(
  "/api/authority-search",
  globalThis.location.origin,
).href;

export const handlers = [
  http.get(authoritySearchPath, ({ request }) => {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") as AuthoritySearchType | null;
    const nationality = searchParams.get("nationality");
    const controlNumber = searchParams.get("controlNumber");
    const controlNumbers = [
      ...searchParams.getAll("controlNumbers"),
      ...searchParams.getAll("controlNumbers[]"),
    ];
    const heading = searchParams.get("heading");

    const results = authoritySearchMockData.filter(
      (row) =>
        (!type || row.type === authorityTypeLabels[type]) &&
        (!nationality || row.nationality === nationality) &&
        (!controlNumber || row.controlNumber.includes(controlNumber)) &&
        (controlNumbers.length === 0 ||
          controlNumbers.includes(row.controlNumber)) &&
        (!heading || row.heading.includes(heading)),
    );

    return HttpResponse.json(results);
  }),
];
