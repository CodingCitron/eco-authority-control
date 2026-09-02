import z from "zod";

import { apiClient, requestAccessTokenRefresh } from "@/lib/axios";
export { STORAGE_TOKEN_KEY } from "@/lib/auth-token";

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
  const { data } = await apiClient.post<unknown>("/auth/login", params);
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
  return refreshAccessTokenResponseSchema.parse(
    await requestAccessTokenRefresh(),
  );
}

// 로그아웃 api - 리프레시 토큰 제거
export async function fetchLogout() {
  await apiClient.post("/auth/logout");
}

export const profileResponseSchema = z.object({
  data: profileSchema,
});

export type ProfileResponse = z.infer<typeof profileResponseSchema>;

// 프로필 api, 프로필 요청 및 토큰 유효성 검증
export async function fetchProfile() {
  const { data } = await apiClient.get<unknown>("/auth/profile");
  return profileResponseSchema.parse(data);
}
