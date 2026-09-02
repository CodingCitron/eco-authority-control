import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Outlet, useNavigate } from "react-router";

import { clearAuthSession, useAuthProfile } from "@/hooks/use-auth";
import {
  AUTH_SESSION_INVALIDATED_EVENT,
  type AuthSessionInvalidatedDetail,
} from "@/lib/auth-session";

/** 인증 상태는 복원하지만 자식 라우트 렌더링은 차단하지 않는다. */
export default function AuthBootstrapLayout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useAuthProfile();

  useEffect(() => {
    const handleSessionInvalidated = (event: Event) => {
      const { redirectToSignIn } = (
        event as CustomEvent<AuthSessionInvalidatedDetail>
      ).detail;

      clearAuthSession(queryClient);

      if (redirectToSignIn) {
        navigate("/sign-in", { replace: true });
      }
    };

    window.addEventListener(
      AUTH_SESSION_INVALIDATED_EVENT,
      handleSessionInvalidated,
    );

    return () => {
      window.removeEventListener(
        AUTH_SESSION_INVALIDATED_EVENT,
        handleSessionInvalidated,
      );
    };
  }, [navigate, queryClient]);

  return <Outlet />;
}
