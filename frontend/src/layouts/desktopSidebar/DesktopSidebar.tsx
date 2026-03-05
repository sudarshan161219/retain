import {
  Columns2,
  LayoutDashboard,
  Settings,
  FileText,
  Box,
  ChevronRight,
} from "lucide-react";
import { Nav } from "@/components/nav/Nav";
import { NavLink, Link, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ModalManager } from "@/components/modal/modalManager/ModalManager";
import styles from "./index.module.css";
import { useSidebarStore } from "@/store/sidebarStore/useSidebarStore";
import { CustomTooltip } from "@/components/customTooltip/CustomTooltip";
import { useUser } from "@/hooks/user/useUser";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const DesktopSidebar = () => {
  const location = useLocation();
  const { data: user } = useUser();
  const { collapsed, toggleSidebar } = useSidebarStore();

  const menuItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: `/dashboard/${user?.id}`,
    },
    { label: "Reports", icon: <FileText size={20} />, path: "/reports" },
    // { label: "Settings", icon: <Settings size={20} />, path: "/settings" },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`${styles.sideBar} border-r ${
          collapsed ? `${styles.sideBarClose}` : `${styles.sideBarOpen}`
        }`}
      >
        <div className={styles.myHeader}>
          <NavLink
            to={`/dashboard/${user?.id}`}
            className="flex items-center gap-2 font-bold text-xl tracking-tight"
          >
            <Box size={24} className="text-primary" />
            {!collapsed && "Retain"}
          </NavLink>

          <button className={styles.btn} onClick={toggleSidebar}>
            {/* {!collapsed && <ChevronLeft />} */}
            <Columns2 size={22} className="cursor-pointer text-label" />
          </button>
        </div>

        {/* Sidebar Items */}
        {collapsed ? (
          <nav className={" flex flex-col gap-2 w-full p-2 "}>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <CustomTooltip
                  key={item.path}
                  label={item.label}
                  position="left"
                  className={styles.tooltip}
                >
                  <Link
                    key={item.path}
                    className={`${styles.collapsedBtn} 
                    ${
                      isActive
                        ? `${styles.collapsedBtnsecondary}`
                        : `${styles.collapsedBtnghost}`
                    }`}
                    to={item.path}
                  >
                    {item.icon}
                  </Link>
                </CustomTooltip>
              );
            })}
          </nav>
        ) : (
          <nav className={"flex flex-col gap-1 w-full p-2"}>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <div>
                  <Button
                    key={item.path}
                    variant={isActive ? "secondary" : "ghost"}
                    className="justify-start gap-2 w-full"
                    asChild
                  >
                    <Link to={item.path}>
                      {item.icon}
                      {item.label}
                    </Link>
                  </Button>
                </div>
              );
            })}
          </nav>
        )}

        {!collapsed ? (
          <nav className={" flex flex-col gap-2 w-full p-2 "}>
            <Accordion type="single" collapsible className="w-full border-none">
              <AccordionItem value="settings" className="border-none">
                <AccordionTrigger className="hover:no-underline py-2 px-4 rounded-md hover:bg-accent text-sm font-medium transition-all [&[data-state=open]>svg]:rotate-90">
                  <div className="flex items-center gap-2">
                    <Settings size={20} />
                    <span>Settings</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-1 pt-1 flex flex-col gap-1 pl-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start h-9 w-full"
                    asChild
                  >
                    <Link to="/settings/workspace">Workspace</Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start h-9 w-full"
                    asChild
                  >
                    <Link to="/settings/preferences">Preferences</Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start h-9 w-full"
                    asChild
                  >
                    <Link to="/settings/account">Account</Link>
                  </Button>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </nav>
        ) : (
          <nav className={" flex flex-col gap-2 w-full p-2 "}>
            <CustomTooltip label="Settings" position="left">
              <Link
                to="/settings"
                className={`${styles.collapsedBtn} ${location.pathname.includes("/settings") ? styles.collapsedBtnsecondary : styles.collapsedBtnghost}`}
              >
                <Settings size={20} />
              </Link>
            </CustomTooltip>{" "}
          </nav>
        )}

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

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Topbar */}
        <Nav id={user?.id} />

        {/* Page Content */}
        <main className="flex-1 p-2 overflow-y-auto bg-background">
          <Outlet />
          <ModalManager />
        </main>
      </div>
    </div>
  );
};
