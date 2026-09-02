export const AUTH_SESSION_INVALIDATED_EVENT =
  "authority-control:auth-session-invalidated";

export interface AuthSessionInvalidatedDetail {
  redirectToSignIn: boolean;
}

/** Axios 계층의 인증 실패를 React 라우터와 QueryClient에 전달한다. */
export function notifyAuthSessionInvalidated(
  detail: AuthSessionInvalidatedDetail,
) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent<AuthSessionInvalidatedDetail>(
      AUTH_SESSION_INVALIDATED_EVENT,
      { detail },
    ),
  );
}
