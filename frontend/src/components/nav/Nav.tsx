import { useEffect, useState } from "react";
import { Box, Menu } from "lucide-react";
import { useSidebarStore } from "@/store/sidebarStore/useSidebarStore";
import { UserMenu } from "@/components/dashboard/userMenu/UserMenu";
import { NavLink } from "react-router-dom";
import { MainHeading } from "@/components/mainHeading/MainHeading";
import styles from "./index.module.css";
export const Nav = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const { toggleSidebar } = useSidebarStore();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className={styles.nav}>
      {/* --- Left: Context --- */}
      <div className={styles.leftSection}>
        {isMobile ? (
          <button
            onClick={toggleSidebar}
            className={styles.menuBtn}
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>
        ) : (
          <MainHeading />
        )}
      </div>

      {/* --- Center: Name and logo (mobile) --- */}
      {isMobile && (
        <NavLink
          to="/dashboard"
          className="flex items-center gap-2 font-bold text-xl tracking-tight"
        >
          <Box size={24} className="text-primary" />
          Retain
        </NavLink>
      )}

      {/* --- Right: Actions --- */}
      <div className={styles.rightSection}>
        <UserMenu />
      </div>
    </nav>
  );
};
