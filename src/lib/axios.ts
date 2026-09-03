import { create, isAxiosError, type InternalAxiosRequestConfig } from "axios";

import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "@/lib/auth-token";
import { notifyAuthSessionInvalidated } from "@/lib/auth-session";

const usesMsw = import.meta.env.DEV && import.meta.env.VITE_USE_MSW !== "false";
const baseURL = usesMsw ? "/api" : `${import.meta.env.VITE_API_BASE_URL}/api`;

if (!baseURL) {
  throw new Error("VITE_API_BASE_URL 값이 설정되지 않았습니다.");
}

export const apiClient = create({
  baseURL,
  withCredentials: true,
});

const refreshClient = create({
  baseURL,
  withCredentials: true,
});

export interface AccessTokenRefreshResponse {
  data: {
    tokenType: string;
    accessToken: string;
  };
}

interface AuthRetryRequestConfig extends InternalAxiosRequestConfig {
  _authRetry?: boolean;
}

let refreshRequest: Promise<AccessTokenRefreshResponse> | null = null;

function parseAccessTokenRefreshResponse(
  value: unknown,
): AccessTokenRefreshResponse {
  if (!value || typeof value !== "object" || !("data" in value)) {
    throw new Error("토큰 갱신 응답 형식이 올바르지 않습니다.");
  }

  const data = value.data;

  if (
    !data ||
    typeof data !== "object" ||
    !("tokenType" in data) ||
    typeof data.tokenType !== "string" ||
    !("accessToken" in data) ||
    typeof data.accessToken !== "string"
  ) {
    throw new Error("토큰 갱신 응답 형식이 올바르지 않습니다.");
  }

  return {
    data: {
      tokenType: data.tokenType,
      accessToken: data.accessToken,
    },
  };
}

/** HttpOnly refresh cookie로 access token을 한 번만 갱신한다. */
export function requestAccessTokenRefresh() {
  if (!refreshRequest) {
    refreshRequest = refreshClient
      .post<unknown>("/ac/auth/refresh")
      .then(({ data }) => parseAccessTokenRefreshResponse(data))
      .then((response) => {
        setAccessToken(response.data.accessToken);
        return response;
      })
      .finally(() => {
        refreshRequest = null;
      });
  }

  return refreshRequest;
}

function isRefreshExcludedRequest(url?: string) {
  return (
    url?.includes("/ac/auth/login") ||
    url?.includes("/ac/auth/refresh") ||
    url?.includes("/ac/auth/logout")
  );
}

apiClient.interceptors.request.use((config) => {
  const accessToken = getAccessToken();

  if (accessToken && !config.headers.has("Authorization")) {
    config.headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (
      !isAxiosError(error) ||
      error.response?.status !== 401 ||
      !error.config
    ) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as AuthRetryRequestConfig;
    if (isRefreshExcludedRequest(originalRequest.url)) {
      return Promise.reject(error);
    }

    const hadAuthenticatedSession = Boolean(getAccessToken());

    if (originalRequest._authRetry) {
      clearAccessToken();

      if (hadAuthenticatedSession) {
        notifyAuthSessionInvalidated({ redirectToSignIn: true });
      }

      return Promise.reject(error);
    }

    originalRequest._authRetry = true;

    try {
      const response = await requestAccessTokenRefresh();
      originalRequest.headers.set(
        "Authorization",
        `Bearer ${response.data.accessToken}`,
      );

      return apiClient(originalRequest);
    } catch (refreshError) {
      clearAccessToken();

      if (hadAuthenticatedSession) {
        notifyAuthSessionInvalidated({ redirectToSignIn: true });
      }

      return Promise.reject(refreshError);
    }
  },
);
