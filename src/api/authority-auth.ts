import z from "zod";

import { apiClient } from "@/lib/axios";

export const STORAGE_TOKEN_KEY = "authority-control:access-token";

// 로그인 api 작성
export interface SignInQueryParams {
  id: string;
  password: string;
}

export const profileSchema = z.object({
  userId: z.string(),
  name: z.string(),
  userClassCode: z.string(),
});

export const tokenSchema = z.object({
  tokenType: z.string(),
  accessToken: z.string(),
});

export type Profile = z.infer<typeof profileSchema>;
export type Token = z.infer<typeof tokenSchema>;

export const SignInResponseSchema = z.object({
  data: z.object({
    user: profileSchema,
    ...tokenSchema.shape,
  }),
});

export type SignInResponse = z.infer<typeof SignInResponseSchema>;

export async function fetchSignIn(params: SignInQueryParams) {
  const { data } = await apiClient.post<unknown>("/ac/auth/login", params);
  return SignInResponseSchema.parse(data);
}

// 리프레시 토큰 api
export const refreshAccessTokenResponseSchema = z.object({
  data: z.object({
    ...tokenSchema.shape,
  }),
});

export type RefreshAccessTokenResponse = z.infer<
  typeof refreshAccessTokenResponseSchema
>;

export async function fetchRefreshAccessToken() {
  const { data } = await apiClient.post<unknown>("/ac/auth/refresh");
  return refreshAccessTokenResponseSchema.parse(data);
}

// 로그아웃 api - 리프레시 토큰 제거
export async function fetchLogout() {
  await apiClient.post("/ac/auth/logout");
}

export const profileResponseSchema = z.object({
  data: profileSchema,
});

export type ProfileResponse = z.infer<typeof profileResponseSchema>;

// 프로필 api, 프로필 요청 및 토큰 유효성 검증
export async function fetchProfile() {
  const { data } = await apiClient.get<unknown>("/ac/auth/profile");
  return profileResponseSchema.parse(data);
}

// 로그인 시
// 토큰 로컬 스토리지에 저장
// react-query에 유저 데이터 저장

// 새로고침시 토큰으로 프로필 조회

// api 요청시 토큰 헤더에 담기

// api 에서 인증 오류 401 받으면
// 토큰 삭제, 프로필 데이터 삭제, 로그인 페이지로 리다이렉트
// 쿼리 데이터 모두 삭제

// 로그아웃
// 토큰 삭제, 프로필 데이터 삭제
// 로그인 페이지로 이동
// 쿼리 데이터 모두 삭제

// 루트 레이아웃 (반드시 필요하지 않음)
// 토큰이 없으면 로그인 페이지로 이동
// 로그인 페이지에서 토큰이 있으면 메인 페이지로 이동
