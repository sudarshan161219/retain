import { Navigate } from "react-router-dom";
import { DashboardLayout } from "@/layouts/dashboardLayout/DashboardLayout";
import { LoadingSpinner } from "@/components/loading/loading";
import { useUser } from "@/hooks/user/useUser";

export const PrivateRoutes = () => {
  const { data: user, isLoading } = useUser();

  if (isLoading) return <LoadingSpinner />;

  return user ? <DashboardLayout /> : <Navigate to="/auth" />;
};
