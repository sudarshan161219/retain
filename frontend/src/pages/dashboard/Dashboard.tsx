import { CreateClientModal } from "@/components/modal/createClientModal/CreateClientModal";
import { EditClientModal } from "@/components/modal/editClientModal/EditClientModal";
import { Clients } from "@/components/dashboard/clients/Clients";
import { Header } from "@/components/dashboard/header_actions/Header";
import { SearchBar } from "@/components/dashboard/searchBar/SearchBar";
import styles from "./index.module.css";
export const Dashboard = () => {
  return (
    <div className={styles.container}>
      {/* 1. HEADER & ACTIONS */}
      <Header />

      {/* 2. SEARCH BAR */}
      <SearchBar />

      {/* 3. CONTENT AREA */}
      <Clients />

      <CreateClientModal />
      <EditClientModal />
    </div>
  );
};
