import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Loader2,
  Sun,
  Moon,
  LogOut,
  User as UserIcon,
} from "lucide-react";

import { useLogout } from "@/hooks/user/useLogout";
import { useThemeStore } from "@/store/theme/useThemeStore";
import { useUser } from "@/hooks/user/useUser";
import styles from "./index.module.css";

export const DashboardNavbar = () => {
  const navigate = useNavigate();
  const { data: user, isLoading: isUserLoading } = useUser();
  const { mutate: logout, isPending } = useLogout();
  const { theme, toggleLight, toggleDark } = useThemeStore();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => navigate("/login"),
    });
  };

  const handleThemeToggle = () => {
    if (theme === "dark") {
      toggleLight();
    } else {
      toggleDark();
    }
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        {/* --- Left: BRANDING --- */}
        <div className={styles.leftSection}>
          <Link to="/dashboard" className={styles.brandLink}>
            <div className={styles.logoBox}>
              <LayoutDashboard size={20} strokeWidth={2} />
            </div>
            <span className={styles.brandText}>Retain</span>
          </Link>
        </div>

        {/* --- Right: USER & ACTIONS --- */}
        <div className={styles.rightSection}>
          {/* Theme Toggle */}
          <button
            onClick={handleThemeToggle}
            className={styles.iconButton}
            title={theme === "dark" ? "Switch to Light" : "Switch to Dark"}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className={styles.dividerVertical}></div>

          {/* User Profile Badge */}
          {isUserLoading ? (
            <Loader2 size={18} className="animate-spin text-gray-400" />
          ) : user ? (
            <div className={styles.userProfile}>
              <div className={styles.avatarContainer}>
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className={styles.avatarImage}
                  />
                ) : (
                  <div className={styles.avatarFallback}>
                    <UserIcon size={16} />
                  </div>
                )}
              </div>

              <span className={styles.userName}>{user.name || "User"}</span>
            </div>
          ) : null}

          <div className={styles.dividerVertical}></div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={styles.logoutButton}
            disabled={isPending}
            title="Sign Out"
          >
            <LogOut size={16} />
            <span className={styles.hideMobile}>Sign Out</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
