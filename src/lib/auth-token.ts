export const STORAGE_TOKEN_KEY = "authority-control:access-token";

export function getAccessToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(STORAGE_TOKEN_KEY);
}

export function setAccessToken(accessToken: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_TOKEN_KEY, accessToken);
}

export function clearAccessToken() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_TOKEN_KEY);
}
