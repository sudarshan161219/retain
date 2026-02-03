import { useEffect, useState } from "react";
import { MobileSidebar } from "@/layouts/mobileSidebar/MobileSidebar";
import { DesktopSidebar } from "@/layouts/desktopSidebar/DesktopSidebar";

export const DashboardLayout = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile ? <MobileSidebar /> : <DesktopSidebar />;
};
