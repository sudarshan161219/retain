import { CreateClientModal } from "@/components/modal/createClientModal/CreateClientModal";
import { Clients } from "@/components/dashboard/clients/Clients";
import { Header } from "@/components/dashboard/header_actions/Header";
import { SearchBar } from "@/components/dashboard/searchBar/SearchBar";

// --- SUB-COMPONENTS ---

export const Dashboard = () => {
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* 1. HEADER & ACTIONS */}
      <Header />

      {/* 2. SEARCH BAR */}
      <SearchBar />

      {/* 3. CONTENT AREA */}
      <Clients />

      <CreateClientModal />
    </div>
  );
};
