import { isAxiosError } from "axios";
import z from "zod";

import type { MarcEditorSaveError } from "@/types/marc-editor.types";

const authoritySaveErrorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z
      .array(
        z.object({
          severity: z.string().optional(),
          code: z.string(),
          message: z.string(),
          path: z.string().optional(),
          tag: z.string().optional(),
          actual: z.unknown().optional(),
        }),
      )
      .optional(),
  }),
});

/** Axios 오류에 포함된 전거 저장 API의 구조화된 오류. */
export function getAuthoritySaveError(
  error: unknown,
): MarcEditorSaveError | undefined {
  if (!isAxiosError(error)) {
    return undefined;
  }

  const result = authoritySaveErrorResponseSchema.safeParse(
    error.response?.data,
  );

  if (!result.success) {
    return undefined;
  }

  return {
    ...result.data.error,
    details: result.data.error.details ?? [],
  };
}
