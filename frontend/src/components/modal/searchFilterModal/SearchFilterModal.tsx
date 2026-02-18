import { useState, useMemo } from "react";
import { X, Search, ChevronRight, Inbox } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useModalStore } from "@/store/modalStore/useModalStore";
import api from "@/lib/api/api";
import styles from "./index.module.css";

export const SearchFilterModal = () => {
  const { isOpen, type, closeModal } = useModalStore();
  const navigate = useNavigate();

  // Local Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "PAUSED">(
    "ALL",
  );

  // 1. Fetch Data Directly
  const { data: clients, isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const res = await api.get("/clients");
      return res.data;
    },
    enabled: isOpen && type === "SEARCH_FILTERS",
  });

  // 2. Filter Logic (Memoized)
  const filteredClients = useMemo(() => {
    if (!clients) return [];

    return clients.data.filter((client: any) => {
      const matchesSearch = client.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "ALL" || client.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [clients, searchTerm, statusFilter]);

  // Handle Navigation
  const handleSelectClient = (clientId: string) => {
    closeModal();
    navigate(`/clients/${clientId}`); // Navigate to details page
  };

  if (!isOpen || type !== "SEARCH_FILTERS") return null;

  return (
    <div className={styles.overlay} onClick={closeModal}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className={styles.header}>
          <h2 className={styles.title}>Find Client</h2>
          <button className={styles.closeBtn} onClick={closeModal}>
            <X size={20} />
          </button>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className={styles.searchArea}>
          {/* Input */}
          <div className={styles.inputWrapper}>
            <Search className={styles.searchIcon} size={18} />
            <input
              autoFocus
              className={styles.searchInput}
              placeholder="Type to search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Chips */}
          <div className={styles.filterRow}>
            {(["ALL", "ACTIVE", "PAUSED"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`${styles.filterChip} ${statusFilter === status ? styles.active : ""}`}
              >
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* RESULTS LIST */}
        <div className={styles.resultsList}>
          {isLoading ? (
            <div className={styles.emptyState}>Loading...</div>
          ) : filteredClients.length > 0 ? (
            filteredClients.map((client: any) => (
              <div
                key={client.id}
                className={styles.resultItem}
                onClick={() => handleSelectClient(client.id)}
              >
                <div>
                  <div className={styles.clientName}>
                    {client.name}
                    <span
                      className={`${styles.statusBadge} ${styles[`status${client.status}`]}`}
                    >
                      {client.status}
                    </span>
                  </div>
                  <div className={styles.clientMeta}>
                    {client.currentBalance} hrs remaining • {client.currency}
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <Inbox size={48} strokeWidth={1} />
              <p>No clients found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
