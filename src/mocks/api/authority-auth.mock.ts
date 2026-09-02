import { http, HttpResponse } from "msw";

import { createApiResponse } from "@/mocks/utils";

const mockAccessToken = "mock-authority-access-token";
const mockProfile = {
  userId: "admin",
  name: "홍길동",
  userClassCode: "ADMIN",
};

export const authorityAuthHandlers = [
  http.post("/api/ac/auth/login", () =>
    createApiResponse({
      data: {
        user: mockProfile,
        tokenType: "Bearer",
        accessToken: mockAccessToken,
      },
    }),
  ),
  // 기본 개발 환경은 익명 상태로 시작한다.
  http.post("/api/ac/auth/refresh", () =>
    HttpResponse.json(
      { error: { code: "UNAUTHORIZED", message: "로그인이 필요합니다." } },
      { status: 401 },
    ),
  ),
  http.get("/api/ac/auth/profile", ({ request }) => {
    if (request.headers.get("Authorization") !== `Bearer ${mockAccessToken}`) {
      return HttpResponse.json(
        { error: { code: "UNAUTHORIZED", message: "로그인이 필요합니다." } },
        { status: 401 },
      );
    }

    return createApiResponse({ data: mockProfile });
  }),
  http.post("/api/ac/auth/logout", () => new HttpResponse(null, { status: 204 })),
];
