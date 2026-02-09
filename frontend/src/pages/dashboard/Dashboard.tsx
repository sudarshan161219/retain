import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreateClientModal } from "@/components/modal/createClientModal/CreateClientModal";
import { Plus, Clock, MoreVertical, Search } from "lucide-react";
import styles from "./index.module.css";
import { useModalStore } from "@/store/modalStore/useModalStore";

const DUMMY_CLIENTS = [
  {
    id: "1",
    name: "Acme Corp",
    status: "ACTIVE",
    totalHours: 40,
    usedHours: 25.5,
    lastUpdated: "2 hours ago",
  },
  {
    id: "2",
    name: "Stark Industries",
    status: "ACTIVE",
    totalHours: 120,
    usedHours: 115,
    lastUpdated: "1 day ago",
  },
  {
    id: "3",
    name: "Wayne Ent.",
    status: "PAUSED",
    totalHours: 50,
    usedHours: 10,
    lastUpdated: "5 days ago",
  },
  {
    id: "4",
    name: "Cyberdyne Systems",
    status: "ACTIVE",
    totalHours: 200,
    usedHours: 45,
    lastUpdated: "Just now",
  },
];

export const Dashboard = () => {
  const { openModal } = useModalStore();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <p>Overview of your active retainers.</p>
        </div>

        <Button
          className="cursor-pointer"
          onClick={() => openModal("CREATE_CLIENT")}
        >
          <Plus size={18} />
          New Client
        </Button>
      </div>

      {/* Stats  */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Revenue</span>
          <div className={styles.statValue}>$12,450</div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Hours Logged</span>
          <div className={styles.statValue}>195.5</div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Active Clients</span>
          <div className={styles.statValue}>4</div>
        </div>
      </div>

      {/* SEARCH (Layout only) */}
      <div style={{ position: "relative", marginBottom: "2rem" }}>
        <Search
          size={18}
          style={{
            position: "absolute",
            left: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#9ca3af",
          }}
        />
        <input
          type="text"
          placeholder="Search clients..."
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {/* GRID */}
      <div className={styles.grid}>
        {DUMMY_CLIENTS.map((client) => {
          // Logic for progress bar color
          const percentage = (client.usedHours / client.totalHours) * 100;
          let barColor = "#10b981"; // Green (Default)
          if (percentage > 75) barColor = "#f59e0b"; // Orange (Warning)
          if (percentage > 90) barColor = "#ef4444"; // Red (Danger)

          return (
            <div key={client.id} className={styles.card}>
              {/* Card Header */}
              <div className={styles.cardHeader}>
                <div>
                  <h3 className={styles.clientName}>{client.name}</h3>
                  <div style={{ marginTop: "0.25rem" }}>
                    <span
                      className={`${styles.badge} ${client.status === "ACTIVE" ? styles.badgeActive : styles.badgePaused}`}
                    >
                      {client.status}
                    </span>
                  </div>
                </div>
                <button style={{ color: "var(--label)", padding: "4px" }}>
                  <MoreVertical size={16} />
                </button>
              </div>

              {/* Progress Section */}
              <div className={styles.progressSection}>
                <div className={styles.progressLabels}>
                  <span style={{ fontWeight: 600, color: "var(--label)" }}>
                    {client.usedHours} hrs used
                  </span>
                  <span style={{ color: "var(--label)" }}>
                    of {client.totalHours}
                  </span>
                </div>

                <div className={styles.progressTrack}>
                  <div
                    className={styles.progressFill}
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: barColor,
                    }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className={styles.cardFooter}>
                <Clock size={14} />
                <span>Updated {client.lastUpdated}</span>
              </div>
            </div>
          );
        })}
      </div>

      <CreateClientModal />
    </div>
  );
};
