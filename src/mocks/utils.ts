import { HttpResponse } from "msw";

/**
 * MSW 공통 API 응답 생성 헬퍼 함수
 */
export function createApiResponse(content: unknown) {
  return HttpResponse.json(content);
}
