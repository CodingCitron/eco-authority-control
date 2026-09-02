import { Navigate, Outlet } from "react-router";

import { useAuthProfile } from "@/hooks/use-auth";

export default function RequireAuth() {
  const { data: profile, isPending } = useAuthProfile();

  if (isPending) {
    return null;
  }

  if (!profile) {
    return <Navigate to="/sign-in" replace />;
  }

  return <Outlet />;
}
