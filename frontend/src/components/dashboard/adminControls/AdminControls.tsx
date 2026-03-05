import { useState } from "react";
import { useRetainerAdmin } from "@/hooks/client/useRetainerAdmin";
import { useModalStore } from "@/store/modalStore/useModalStore";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { RetainerLog } from "@/types/retainer/retainer";
import {
  PlayCircle,
  PauseCircle,
  Archive,
  Plus,
  Loader2,
  Pencil,
  Zap,
  Trash2,
  MoreHorizontal,
  Check,
  Copy,
} from "lucide-react";
import { format } from "date-fns";
import styles from "./index.module.css";
import { useUpdateClientStore } from "@/store/client/updateClientStore/useUpdateClientStore";
import { useUpdateStatus } from "@/hooks/client/useUpdateStatus";
import { toast } from "sonner";
import { useAddLog } from "@/hooks/client/useAddLog";
import { DatePicker } from "@/components/datePicker/DatePicker";
import { useDateStore } from "@/store/dateStore/useDateStore";

type Data = {
  id: string;
  name: string;
  email: string;
  status: "ACTIVE" | "PAUSED" | "ARCHIVED";
  totalHours: string;
  hourlyRate: string;
  hoursLogged: string;
  remainingHours: string;
  currency: string;
  refillLink?: string | null;
  slug: string;
  logs: [];
};

interface AdminControlsProps {
  adminToken: string;
  client: Data;
}

export const AdminControls = ({ adminToken, client }: AdminControlsProps) => {
  const { openModal } = useModalStore();
  const { date: datePicker } = useDateStore();
  const { setFormData } = useUpdateClientStore();
  const { mutate: addLog, isPending: isAddingLog } = useAddLog(adminToken);
  const { mutate } = useUpdateStatus(adminToken);
  const {
    updateStatus,
    updateDetails,

    isUpdatingStatus,
    isUpdatingDetails,
  } = useRetainerAdmin(adminToken);

  // --- LOG FORM ---
  const [logData, setLogData] = useState({
    description: "",
    hours: "",
    date: format(new Date(), "yyyy-MM-dd"),
  });

  // --- COPY LINK ---
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    const url = `${window.location.origin}/${client.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast(
      <div className="flex items-center gap-3">
        <Check size={16} color="#16a34a" /> Public link copied!
      </div>,
    );
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logData.description || !logData.hours) return;
    addLog(
      {
        description: logData.description,
        hours: Number(logData.hours),
        date: new Date(datePicker).toISOString(),
      },
      {
        onSuccess: () =>
          setLogData((prev) => ({ ...prev, description: "", hours: "" })),
      },
    );
  };

  const editBtnHandler = () => {
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

  const hoursSpent = client.logs
    .filter((log: RetainerLog) => log.type !== "REFILL")
    .reduce((acc: number, log: RetainerLog) => acc + Number(log.hours), 0);

  // 2. Calculate Remaining
  const totalHours = Number(client.totalHours);
  const rate = Number(client.hourlyRate || 0);
  const remainingValue = Number(client.hoursLogged || 0) * rate;

  const totalValue = totalHours * rate;

  const remaining = parseFloat(client.remainingHours) || 0;

  const formatMoney = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: client.currency || "USD",
    }).format(amount);

  console.log(logData.date);

  return (
    <div className={styles.stack}>
      {/* 1. BUDGET & STATUS (The "Money" Card) */}
      <div className={styles.card}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2
              className={styles.cardHeader}
              style={{ marginBottom: "0.25rem" }}
            >
              Project Status
            </h2>
            <p className="text-xs text-zinc-500">
              Manage budget and visibility
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => openModal("REFILL_BALANCE")}
              variant="outline"
              className={styles.topUpBtn}
            >
              <Zap size={14} fill="currentColor" />
              Top Up Balance
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer" asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal size={15} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={editBtnHandler}
                >
                  <Pencil size={14} /> Edit Client
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check size={16} color="#16a34a" />
                  ) : (
                    <Copy size={16} />
                  )}{" "}
                  Copy Public Link
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="flex items-center text-red-600 focus:text-red-600 focus:bg-red-200 cursor-pointer"
                  onClick={() => openModal("DELETE_CLIENT")}
                >
                  <Trash2
                    className="text-red-600 focus:text-red-600"
                    size={14}
                  />
                  Delete Client
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className={styles.budgetcard}>
          <div className={styles.budgetsection}>
            <p className={styles.budgetlabel}>Total Budget</p>
            <p className={styles.budgetvalue}>
              {totalHours.toFixed(2)}
              <span className={styles.budgetunit}>hrs</span>
            </p>

            <p className="text-xs text-(--label) font-medium mt-1">
              {formatMoney(Number(totalValue))} at{" "}
              {formatMoney(Number(client.hourlyRate))}/hr
            </p>
          </div>

          <div className={styles.budgetdivider}></div>

          <div className={styles.budgetsection}>
            <p className={styles.budgetlabel}>Remaining</p>
            <p className={styles.budgetvalue}>
              {remaining.toFixed(2)}
              <span className={styles.budgetunit}>hrs</span>
            </p>
            <p
              className={`text-xs font-medium mt-1 ${remaining < 2 ? "text-red-400" : "text-emerald-600"}`}
            >
              {formatMoney(remainingValue)} unbilled
            </p>
          </div>
        </div>

        {/* Status Toggles */}
        <div className={styles.statusGrid}>
          <StatusButton
            active={client.status === "ACTIVE"}
            // onClick={() => updateStatus("ACTIVE")}
            onClick={() => mutate("ACTIVE")}
            label="Active"
            icon={<PlayCircle size={16} />}
            activeClass={styles.statusActive}
            isLoading={isUpdatingStatus && client.status !== "ACTIVE"}
          />
          <StatusButton
            active={client.status === "PAUSED"}
            // onClick={() => updateStatus("PAUSED")}
            onClick={() => mutate("PAUSED")}
            label="Paused"
            icon={<PauseCircle size={16} />}
            activeClass={styles.statusPaused}
            isLoading={isUpdatingStatus && client.status !== "PAUSED"}
          />
          <StatusButton
            active={client.status === "ARCHIVED"}
            // onClick={() => updateStatus("ARCHIVED")}
            onClick={() => mutate("ARCHIVED")}
            label="Done"
            icon={<Archive size={16} />}
            activeClass={styles.statusArchived}
            isLoading={isUpdatingStatus && client.status !== "ARCHIVED"}
          />
        </div>
      </div>

      {/* 3. ADD LOG FORM (Unchanged) */}
      <div className={styles.card}>
        <h2 className={styles.cardHeader}>
          <Plus className={styles.plusIcon} /> Log Hours
        </h2>
        <form onSubmit={handleLogSubmit} className={styles.formStack}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Description</label>
            <input
              type="text"
              className={styles.input}
              placeholder="e.g. Fixed navigation bug on mobile"
              value={logData.description}
              onChange={(e) =>
                setLogData({ ...logData, description: e.target.value })
              }
              disabled={client.status !== "ACTIVE"}
            />
          </div>
          <div className={styles.gridCols2}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Hours</label>
              <input
                type="number"
                step="0.25"
                placeholder="0.00"
                className={styles.input}
                value={logData.hours}
                onChange={(e) =>
                  setLogData({ ...logData, hours: e.target.value })
                }
                disabled={client.status !== "ACTIVE"}
              />
            </div>

            <DatePicker />
          </div>
          <Button
            type="submit"
            disabled={
              isAddingLog ||
              !logData.description ||
              !logData.hours ||
              client.status !== "ACTIVE"
            }
            variant="outline"
            className={styles.submitButton}
          >
            {isAddingLog ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              "Add Entry"
            )}
          </Button>

          {client.status !== "ACTIVE" && (
            <p className={styles.errorMessage}>
              Client is currently {client.status}. Resume to add logs.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

// Helper
const StatusButton = ({
  active,
  onClick,
  label,
  icon,
  activeClass,
  isLoading,
}: any) => {
  const btnClass = `${styles.statusButton} ${active ? activeClass : ""}`;
  return (
    <button
      onClick={onClick}
      disabled={active || isLoading}
      className={btnClass}
    >
      {isLoading ? <Loader2 size={16} className="animate-spin" /> : icon}
      <span className={styles.statusLabel}>{label}</span>
    </button>
  );
};
