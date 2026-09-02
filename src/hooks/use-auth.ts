import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import { useNavigate } from "react-router";

import {
  fetchLogout,
  fetchProfile,
  fetchSignIn,
  type Profile,
} from "@/api/authority-auth";
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "@/lib/auth-token";

export const authQueryKeys = {
  all: ["auth"] as const,
  profile: () => [...authQueryKeys.all, "profile"] as const,
};

export function clearAuthSession(queryClient: QueryClient) {
  clearAccessToken();
  queryClient.clear();
}

async function restoreAuthProfile(): Promise<Profile | null> {
  if (!getAccessToken()) {
    return null;
  }

  try {
    const response = await fetchProfile();
    return response.data;
  } catch (error) {
    // 401과 refresh 실패는 Axios 인터셉터가 access token을 정리한다.
    if (!getAccessToken()) {
      return null;
    }

    throw error;
  }
}

/** 저장된 access token으로 현재 사용자를 복원한다. */
export function useAuthProfile() {
  return useQuery({
    queryKey: authQueryKeys.profile(),
    queryFn: restoreAuthProfile,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useSignIn() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: fetchSignIn,
    onSuccess: async ({ data }) => {
      await queryClient.cancelQueries({ queryKey: authQueryKeys.profile() });

      setAccessToken(data.accessToken);
      queryClient.setQueryData(authQueryKeys.profile(), data.user);

      navigate("/", { replace: true });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: fetchLogout,
    onSettled: () => {
      clearAuthSession(queryClient);
      navigate("/sign-in", { replace: true });
    },
  });
}
