import { Box } from "lucide-react";
import { SignupForm } from "@/components/signup-form";
import { LoginForm } from "@/components/login-form";
import styles from "./index.module.css";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore/useAuthStore";
import { useUser } from "@/hooks/user/useUser";

export const Auth = () => {
  const { isSignUp } = useAuthStore();
  const navigate = useNavigate();
  const { data: user } = useUser();

  if (user?.id) {
    navigate(`/dashboard/${user.id}`);
  }

  const handlenavigate = () => {
    navigate("/");
  };

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <div onClick={handlenavigate} className={styles.brand}>
          <Box className={styles.icon} size={24} strokeWidth={3} />
          <span className={styles.heading}>Retain</span>
          <span className={styles.brandTag}>Self-Hosted</span>
        </div>
      </nav>

      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          {isSignUp ? <SignupForm /> : <LoginForm />}
        </div>
      </div>
    </div>
  );
};
