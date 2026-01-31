import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.css";

export const ForgotPasswordRequest = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    // Simulate an API call
    try {
      // await api.requestPasswordReset(email);
      console.log(`Reset link sent to: ${email}`);

      setTimeout(() => {
        setStatus("success");
      }, 1500);
    } catch (error) {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const handleNavigate = () => {
    navigate("/auth");
  };

  if (status === "success") {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.iconSuccess}>✓</div>
          <h2 className={styles.title}>Check your email</h2>
          <p className={styles.text}>
            Reset link sent to <strong>{email}</strong>.
          </p>
          <Button
            className="cursor-pointer"
            variant="default"
            onClick={() => setStatus("idle")}
          >
            Resend Email
          </Button>

          <Button
            onClick={handleNavigate}
            className="cursor-pointer"
            variant="link"
          >
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Forgot Password?</h1>
        <p className={styles.text}>Enter your email to receive a reset link.</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className={styles.input}
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={status === "loading"}
            />
          </div>

          {status === "error" && (
            <div className={styles.errorMessage}>{errorMessage}</div>
          )}

          <Button
            type="submit"
            variant="default"
            className="cursor-pointer"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>

        <div className={styles.footer}>
          <Button
            onClick={handleNavigate}
            variant="link"
            className="cursor-pointer"
          >
            ← Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
};
