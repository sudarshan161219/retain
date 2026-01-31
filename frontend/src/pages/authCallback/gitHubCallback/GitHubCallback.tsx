import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./index.module.css";

export const GitHubCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const processedRef = useRef(false);
  useEffect(() => {
    const code = searchParams.get("code");

    if (!code || processedRef.current) return;

    processedRef.current = true; // Mark as processing

    const loginWithGitHub = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/auth/github", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message || "Login failed");

        localStorage.setItem("token", data.token);

        navigate("/dashboard");
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
