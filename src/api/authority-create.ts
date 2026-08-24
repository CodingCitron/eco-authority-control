import z from "zod";

import { apiClient } from "@/lib/axios";
import type {
  AuthorityControlField,
  AuthorityDataField,
} from "@/types/authority-detail.types";
import type { AuthoritySearchType } from "@/types/authority-search.types";
import { authorityDetailResponseSchema } from "./authority-detail";

export interface AuthorityCreateQueryParams {
  acType: AuthoritySearchType;
  acRegionCode: string;
  activityField: string;
  hanjaName?: string;
  headingName?: string;
  birthDeathDate?: string;
  firstInputDate?: string;
  firstWorker?: string;
  lastUpdateDate?: string;
  lastWorker?: string;
  record: {
    leader: string;
    control_fields: AuthorityControlField[];
    data_fields: AuthorityDataField[];
  };
}

export async function fetchAuthorityCreate(params: AuthorityCreateQueryParams) {
  const { data } = await apiClient.post<unknown>("/ac", params);
  return authorityDetailResponseSchema.parse(data);
}
