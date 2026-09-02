import z from "zod";
import { apiClient } from "@/lib/axios";
import type { AuthorityCreateQueryParams } from "./authority-create";

export interface AuthorityDuplicateCheckQueryParams extends AuthorityCreateQueryParams {}

const authorityDuplicateCheckResponseSchema = z.object({
  data: z.object({
    duplicate: z.boolean(),
    acType: z.string(),
    headingName: z.string(),
    matches: z.array(
      z.object({
        recKey: z.string(),
        acControlNo: z.string(),
        acType: z.string(),
        headingName: z.string(),
      }),
    ),
  }),
});

export async function fetchAuthorityDuplicateCheck(
  params: AuthorityDuplicateCheckQueryParams,
) {
  const { data } = await apiClient.post("/ac/duplicate-check", params);
  return authorityDuplicateCheckResponseSchema.parse(data);
}
