import { Routes, Route } from "react-router-dom";
import { Dashboard } from "@/pages/dashboard/Dashboard";
import { ClientView } from "@/pages/clientView/ClientView";
import { Landing } from "@/pages/landing/Landing";
import { Auth } from "@/pages/auth/Auth";
import { ForgotPasswordRequest } from "@/pages/forgotPassword/forgotPasswordRequest/ForgotPasswordRequest";
import { ResetPassword } from "@/pages/forgotPassword/ResetPassword/ResetPassword";
import { GitHubCallback } from "@/pages/authCallback/gitHubCallback/GitHubCallback";
import { AppLayout } from "@/layouts/AppLayout";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth/github/callback" element={<GitHubCallback />} />
      <Route path="/forgot-password" element={<ForgotPasswordRequest />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/auth" element={<Auth />} />
      <Route element={<AppLayout />}>
        <Route path="/manage/:adminToken" element={<Dashboard />} />
      </Route>
      <Route path="/:slug" element={<ClientView />} />
    </Routes>
  );
};
