import { useState } from "react";
import { Button } from "@/components/ui/button";
import styles from "./index.module.css";

export const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  // in a real app, you'd extract the token from the URL here
  // const token = new URLSearchParams(window.location.search).get('token');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing again
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setStatus("loading");

    // 2. Simulate API Call
    try {
      // await api.resetPassword(token, formData.password);
      setTimeout(() => {
        setStatus("success");
      }, 1500);
    } catch (err) {
      setStatus("error");
      setError("Token expired or invalid.");
    }
  };

  if (status === "success") {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.iconSuccess}>✓</div>
          <h2 className={styles.title}>Password Reset</h2>
          <p className={styles.text}>
            Your password has been updated successfully.
          </p>
          <a href="/login" className={styles.buttonPrimary}>
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Set new password</h1>
        <p className={styles.text}>
          Please choose a new password for your account.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Password Field */}
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              New Password
            </label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                className={styles.input}
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className={styles.toggleBtn}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Confirm Field */}
          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Confirm Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              id="confirmPassword"
              className={styles.input} // Uses same input style
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <Button
            type="submit"
            className={styles.buttonPrimary}
            disabled={status === "loading"}
          >
            {status === "loading" ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </div>
    </div>
  );
};
