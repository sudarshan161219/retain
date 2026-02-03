import { useState, useRef, useEffect } from "react";
import { LogOut, User as UserIcon, Settings, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/user/useUser";
import styles from "./index.module.css";

export const UserMenu = () => {
  const navigate = useNavigate();
  const { data: user, isLoading: isUserLoading } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    navigate("/login");
  };

  if (!user) return null;

  // Get Initials (e.g. "Sudarshan Hosalli" -> "SH")
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "ME";

  return (
    <div className={styles.container} ref={menuRef}>
      {/* TRIGGER BUTTON */}
      <button onClick={() => setIsOpen(!isOpen)} className={styles.pill}>
        <div className={styles.responsiveText}>
          <div className={styles.titlesm}>{user.name}</div>
          <div className={styles.metaText}>Free Plan</div>
        </div>

        {user.avatar ? (
          <div className={styles.avatarBadge}>
            <img
              src={user.avatar}
              alt={user.name}
              className={styles.avatarImage}
            />
          </div>
        ) : (
          <div className={styles.avatarBadge}>{initials}</div>
        )}

        <ChevronDown
          size={14}
          className={`text-(--label) transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* DROPDOWN MENU */}
      {isOpen && (
        <div className={styles.menu}>
          <div className={styles.sectionMobile}>
            <p className={styles.name}>{user.name}</p>
            <p className={styles.emailSmall}>{user.email}</p>
          </div>

          <div className={styles.sectionDesktop}>
            <p className={styles.label}>Signed in as</p>
            <p className={styles.email}>{user.email}</p>
          </div>

          <div className={styles.buttonGroup}>
            <button
              onClick={() => navigate("/settings")}
              className={styles.button}
            >
              <UserIcon size={16} />
              Profile Settings
            </button>

            <button
              onClick={() => navigate("/settings/billing")}
              className={styles.button}
            >
              <Settings size={16} />
              Preferences
            </button>
          </div>

          <div className={styles.logoutSection}>
            <button
              onClick={handleLogout}
              className={`${styles.button} ${styles.buttonDanger}`}
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
