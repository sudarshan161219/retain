import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import api from "@/lib/api/api";
import styles from "./index.module.css";

export const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const processedRef = useRef(false);

  useEffect(() => {
    const code = searchParams.get("code");
    const isGoogle = location.pathname.includes("google");
    const provider = isGoogle ? "google" : "github";

    if (!code || processedRef.current) return;

    processedRef.current = true;

    const loginWithProvider = async () => {
      try {
        const { data } = await api.get(
          `/auth/${provider}/callback?code=${code}`,
        );

        const { success, message, id } = data;

        if (!success) {
          throw new Error(message || "Login failed");
        }

        navigate(`/dashboard/${id}`);
      } catch (error) {
        console.error(`${provider} Auth Error:`, error);
        navigate(`/login?error=${provider}_failed`);
      }
    };

    loginWithProvider();
  }, [searchParams, navigate, location.pathname]);

  return (
    <div className={styles.container}>
      <div className={styles.loader}></div>
      <p className={styles.text}>
        Verifying {location.pathname.includes("google") ? "Google" : "GitHub"}
        ...
      </p>
    </div>
  );
};
