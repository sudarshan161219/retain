import { AppRoutes } from "@/routes/AppRoutes";
import { Toaster } from "@/components/ui/sonner";
export const App = () => {
  return (
    <>
      <AppRoutes />
      <Toaster richColors />
    </>
  );
};
