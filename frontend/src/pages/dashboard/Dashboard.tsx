import { Clients } from "@/components/dashboard/clients/Clients";
import { Header } from "@/components/dashboard/header_actions/Header";
import { Toolbar } from "@/components/dashboard/toolbar/Toolbar";
import styles from "./index.module.css";
export const Dashboard = () => {
  return (
    <div className={styles.container}>
      {/* 1. HEADER & ACTIONS */}
      <Header />

      {/* 2. Search Bar, Filter and Add Client Button */}
      <Toolbar />
      {/* 3. CONTENT AREA */}
      <Clients />

    </div>
  );
};
