import { useMemo, useState } from "react";
import { useGetAllClients } from "@/hooks/client/useGetAllClients";
import styles from "./index.module.css";
import { formatDistanceToNow } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Edit2,
  PauseCircle,
  Archive,
  LinkIcon,
} from "lucide-react";
import { StatusBadge } from "@/components/statusBadge/StatusBadge";
import { ProgressBar } from "@/components/progressBar/ProgressBar";
import { getRandomGradient } from "@/lib/randomGradientGen/randomGradientGen";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUpdateClientStore } from "@/store/updateClientStore/useUpdateClientStore";
import { useModalStore } from "@/store/modalStore/useModalStore";

type Data = {
  id: string;
  name: string;
  email: string;
  totalHours: string;
  hourlyRate: string;
  currency: string;
  refillLink?: string | null;
};

export const Clients = () => {
  const { data: clients, isLoading } = useGetAllClients();
  const { openModal } = useModalStore();
  const { setFormData } = useUpdateClientStore();
  // --- STATE ---
  const [avatarBg] = useState(getRandomGradient());
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // --- LOGIC ---
  const filteredData = useMemo(() => {
    if (!clients) return [];
    return clients.filter((c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [clients, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  const editBtnHandler = (client: Data) => {
    if (!client) return;
    openModal("EDIT_CLIENT");
    const totalHours = Number(client.totalHours);
    const hourlyRate = Number(client.hourlyRate);
    setFormData({
      id: client.id,
      name: client.name,
      email: client.email,
      totalHours: totalHours,
      hourlyRate: hourlyRate,
      currency: client.currency,
      refillLink: client.refillLink,
    });
  };

  return (
    <div className={styles.clientsCard}>
      {isLoading ? (
        <div className={styles.clientsLoading}>Loading clients...</div>
      ) : currentData.length === 0 ? (
        <div className={styles.clientsEmpty}>
          <p className={styles.clientsEmptyText}>No clients found</p>
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE */}
          <div className={styles.clientstableWrapper}>
            <table className={styles.clientsTable}>
              <thead className="clients-thead">
                <tr>
                  <th className={styles.client}>Client</th>
                  <th className={styles.status}>Status</th>
                  <th className={styles.clientsUsageCol}>Usage</th>
                  <th className={styles.updated}>Updated</th>
                  <th className={styles.actions}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {currentData.map((client) => (
                  <tr key={client.id} className="clients-row">
                    <td>
                      <div className={styles.clientCell}>
                        <div
                          className={styles.clientAvatar}
                          style={{
                            background: `${avatarBg}`,
                            color: "#000",
                          }}
                        >
                          {client.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className={styles.clientName}>{client.name}</div>
                      </div>
                    </td>

                    <td>
                      <StatusBadge status={client.status} />
                    </td>

                    <td className="clients-progress">
                      <ProgressBar
                        used={Number(client.hoursLogged)}
                        total={Number(client.totalHours)}
                        compact
                      />
                    </td>

                    <td className={styles.clientsUpdated}>
                      {client.lastLogAt
                        ? formatDistanceToNow(new Date(client.lastLogAt), {
                            addSuffix: true,
                          })
                        : "Never"}
                    </td>

                    <td className={styles.clientsActions}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            className="cursor-pointer"
                            variant="outline"
                            size="sm"
                          >
                            <MoreHorizontal size={18} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem className="cursor-pointer">
                            <LinkIcon size={14} /> Copy Public Link
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => editBtnHandler(client)}
                          >
                            <Edit2 size={14} /> Edit Client
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <PauseCircle size={14} /> Pause Retainer
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Archive size={14} /> Archive
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS */}
          <div className={styles.clientsMobile}>
            {currentData.map((client) => (
              <div key={client.id} className={styles.clientsMobileCard}>
                {/* top row */}
                <div className={styles.mobileHeader}>
                  <div className={styles.mobileclientInfo}>
                    <div className={styles.mobileAvatar}>
                      {client.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className={styles.mobileName}>{client.name}</h3>
                      <p className={styles.mobileUpdated}>
                        Updated{" "}
                        {client.lastLogAt
                          ? formatDistanceToNow(new Date(client.lastLogAt))
                          : "never"}{" "}
                        ago
                      </p>
                    </div>
                  </div>

                  <button className="iconButton">
                    <MoreHorizontal size={20} />
                  </button>
                </div>

                <div className={styles.mobileProgressBox}>
                  <div className={styles.mobileprogressheader}>
                    <span className={styles.mobileprogresslabel}>
                      Retainer Health
                    </span>
                    <StatusBadge status={client.status} />
                  </div>

                  <ProgressBar
                    used={Number(client.hoursLogged)}
                    total={Number(client.totalHours)}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* PAGINATION */}
      {filteredData.length > 0 && (
        <div className={styles.clientsPagination}>
          <div className={`${styles.paginationInfo} ${styles.desktopOnly}`}>
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </div>

          <div className={`${styles.paginationInfo} ${styles.mobileOnly}`}>
            {currentPage} / {totalPages}
          </div>

          <div className={styles.paginationButtons}>
            <button
              className={styles.paginationBtn}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={14} />
            </button>

            <button
              className={styles.paginationBtn}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
