import {
  CircleX,
  LayoutDashboard,
  FileText,
  Settings,
  Box,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { Nav } from "@/components/nav/Nav";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import styles from "./index.module.css";
import { useSidebarStore } from "@/store/sidebarStore/useSidebarStore";

export const MobileSidebar = () => {
  const location = useLocation();
  const { collapsed, toggleSidebar } = useSidebarStore();

  const menuItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/dashboard",
    },
    { label: "Reports", icon: <FileText size={20} />, path: "/reports" },
    { label: "Settings", icon: <Settings size={20} />, path: "/settings" },
  ];

  return (
    <div className="relative">
      {/* Sidebar */}
      <div
        className={`border-r ${styles.sidebar} transition-all duration-300 ${
          collapsed ? "w-0" : "w-70"
        }`}
      >
        <div
          className={`items-center justify-between p-4 ${styles.header} ${
            collapsed ? "hidden" : "flex"
          }`}
        >
          <NavLink
            to="/dashboard"
            className="flex items-center gap-2 font-bold text-xl tracking-tight"
          >
            <Box size={24} className="text-primary" />
            {!collapsed && "Retain"}
          </NavLink>
          <button
            className={`cursor-pointer z-10 ${collapsed ? "hidden" : "inline"}`}
            onClick={toggleSidebar}
          >
            <CircleX className="cursor-pointer" />
          </button>
        </div>
        {/* Main Menu */}
        <div
          className={`flex flex-col gap-1 mt-4 p-2 ${
            collapsed ? "hidden" : "flex"
          }`}
        >
          <span className=" mb-1 text-sm text-(--label)">menu</span>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={item.path}
                variant={isActive ? "secondary" : "ghost"}
                className="justify-start gap-2 w-full"
                onClick={toggleSidebar}
                asChild
              >
                <Link to={item.path}>
                  {item.icon}
                  {item.label}
                </Link>
              </Button>
            );
          })}
        </div>

        <div
          className={`${
            collapsed ? "hidden" : "flex"
          }  flex-col gap-1 absolute bottom-0 p-4 cursor-pointer w-full `}
        >
          <div className={styles.badgeContainer}>
            <div className={styles.badge}>
              <p>Retain v1.0</p>
              <span>Self-Hosted Edition</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.appcontainer}>
        <Nav />

        <main className={styles.main}>
          <Outlet />
        </main>
      </div>

      <div
        onClick={toggleSidebar}
        className={`${styles.backdrop} ${
          collapsed ? "hidden" : "inline"
        } transition-all duration-300`}
      ></div>
    </div>
  );
};
