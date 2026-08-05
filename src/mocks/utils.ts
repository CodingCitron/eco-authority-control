import { HttpResponse } from "msw";
import type { ApiResponse } from "@/types/api.types";

/**
 * MSW 공통 API 응답 생성 헬퍼 함수
 */
export function createApiResponse<T>(
  contents: T,
  options?: { code?: "Y" | "N"; message?: string; status?: number },
) {
  const { code = "Y", message = "OK", status = 200 } = options || {};

  return HttpResponse.json<ApiResponse<T>>(
    {
      result: {
        debug: "",
        code,
        message,
      },
      contents,
    },
    { status },
  );
}
