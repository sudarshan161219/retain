import { useState, useMemo, useEffect } from "react";
import { X, Search, ChevronRight, Inbox } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useModalStore } from "@/store/modalStore/useModalStore";
import styles from "./index.module.css";
import {
  type Client,
  useSearchFilterClients,
} from "@/hooks/client/useSearchFilterClients";

export const SearchFilterModal = () => {
  const { isOpen, type, closeModal } = useModalStore();
  const navigate = useNavigate();

  // Local States
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "PAUSED">(
    "ALL",
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const {
    data: clients,
    isLoading,
    isFetching,
  } = useSearchFilterClients({
    search: debouncedSearch,
    status: statusFilter === "ALL" ? undefined : statusFilter,
    page: 1,
    limit: 20,
  });

  // 2. Map the data (Memoized)
  const processedClients = useMemo(() => {
    if (!clients?.length) return [];

    return clients.map((client: Client) => {
      const total = Number(client.totalHours) || 0;
      const logged = Number(client.hoursLogged) || 0;

      return {
        ...client,
        hoursRemaining: Math.max(total - logged, 0),
      };
    });
  }, [clients]);

  const handleSelectClient = (clientId: string) => {
    closeModal();
    navigate(`/clients/${clientId}`);
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

        {/* Results lists */}
        <div className={styles.resultsList}>
          {isLoading || (isFetching && !processedClients.length) ? (
            <div className={styles.emptyState}>Loading...</div>
          ) : processedClients.length > 0 ? (
            processedClients.map((client: Client) => (
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
                    {client.hoursRemaining} hrs remaining • {client.currency}
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
