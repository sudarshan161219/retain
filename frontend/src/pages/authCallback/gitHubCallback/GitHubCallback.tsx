import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "@/lib/api/api";
import styles from "./index.module.css";

export const GitHubCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const processedRef = useRef(false);
  useEffect(() => {
    const code = searchParams.get("code");

    if (!code || processedRef.current) return;

    processedRef.current = true;

    const loginWithGitHub = async () => {
      try {
        const { data } = await api.get(`/auth/github/callback?code=${code}`);
        const { success, message, id } = data;
        if (!success) {
          throw new Error(message || "Login failed");
        }
        navigate(`/dashboard/${id}`);
      } catch (error) {
        console.error("GitHub Auth Error:", error);
        navigate("/login?error=github_failed");
      }
    };

    loginWithGitHub();
  }, [searchParams, navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.loader}></div>
      <p className={styles.text}>Verifying GitHub...</p>
    </div>
  );
};
