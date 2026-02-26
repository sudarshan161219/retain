import { Clients } from "@/components/dashboard/clients/Clients";

import { Toolbar } from "@/components/dashboard/toolbar/Toolbar";
import styles from "./index.module.css";
export const Dashboard = () => {
  return (
    <div className={styles.container}>
      {/* 1. Search Bar, Filter and Add Client Button */}
      <Toolbar />
      {/* 2. CONTENT AREA */}
      <Clients />
    </div>
  );
};
