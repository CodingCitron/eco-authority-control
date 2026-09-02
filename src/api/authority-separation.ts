import { apiClient } from "@/lib/axios";

import type { AuthorityCreateQueryParams } from "./authority-create";

import { authorityDetailResponseSchema } from "./authority-detail";

export interface AuthoritySeparationQueryParams extends AuthorityCreateQueryParams {}

export async function fetchAuthoritySeparation(
  params: AuthoritySeparationQueryParams,
) {
  const { data } = await apiClient.post<unknown>("/ac/separate", params);
  return authorityDetailResponseSchema.parse(data);
}
