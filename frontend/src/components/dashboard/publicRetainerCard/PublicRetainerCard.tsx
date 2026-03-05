import { format, isThisWeek } from "date-fns";
import {
  Clock,
  Download,
  AlertCircle,
  MoreHorizontal,
  Trash2,
  Pencil,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModalStore } from "@/store/modalStore/useModalStore";
import {
  type WorkLog,
  useEditLogStore,
} from "@/store/client/editLogStore/useEditLogStore";
import styles from "./index.module.css";

interface ClientData {
  name: string;
  totalHours: string | number;
  refillLink?: string | null;
  status: "ACTIVE" | "PAUSED" | "ARCHIVED";
  remainingHours: string | number;
  logs: WorkLog[];
}

export const PublicRetainerCard = ({ client }: { client: ClientData }) => {
  const { openModal } = useModalStore();
  const { setSelectedLog } = useEditLogStore();
  const total = Number(client.totalHours);
  const remaining = Number(client.remainingHours) || 0;

  const used = client.logs
    .filter((log) => log.type !== "REFILL")
    .reduce((acc, log) => acc + Number(log.hours), 0);

  const percentage = Math.min((used / total) * 100, 100);
  const isOverBudget = remaining < 0;
  const isLowBalance = percentage >= 80 && !isOverBudget;

  const getStatusClass = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return styles.statusActive;
      case "PAUSED":
        return styles.statusPaused;
      default:
        return styles.statusArchived;
    }
  };

  const editBtnHandler = (logData: WorkLog) => {
    openModal("EDIT_LOG");
    setSelectedLog(logData);
  };

  return (
    <div className={styles.card}>
      {/* 1. BRANDING & HEADER */}
      <div className={styles.header}>
        <div>
          <span className="text-xs text-(--label) uppercase tracking-wider font-semibold mb-1">
            Client Portal
          </span>
          <h2 className={styles.title}>{client.name}</h2>
          <div className={styles.metaRow}>
            <p className={styles.statusText}>
              Status:{" "}
              <span className={getStatusClass(client.status)}>
                {client.status}
              </span>
            </p>
          </div>
        </div>

        <button
          onClick={() => openModal("EXPORT_REPORT")}
          className={styles.iconBtn}
          title="Download CSV Report"
        >
          <Download size={18} />
          <span className="sr-only">Download</span>
        </button>
      </div>

      <div className={styles.body}>
        {/* 2. THE HERO METRIC */}
        <div className={styles.cardContainer}>
          <p className="text-sm text-(--label) font-medium mb-2">
            Remaining Balance
          </p>
          <h1
            className={`text-5xl font-bold tracking-tight mb-2 ${isOverBudget ? "text-red-600" : "text-(primary)"}`}
          >
            {isOverBudget ? "-" : ""}
            {Math.abs(remaining).toFixed(1)}{" "}
            <span className="text-xl text-(--label) font-normal">hrs</span>
          </h1>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4 mb-2 overflow-hidden">
            <div
              className={`h-2.5 rounded-full ${isOverBudget ? "bg-red-500" : isLowBalance ? "bg-amber-400" : "bg-black"}`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-(--label) font-medium">
            <span>{used.toFixed(1)} hrs used</span>
            <span>{total.toFixed(1)} hrs total</span>
          </div>
        </div>

        {/* 3. SMART REFILL CALL-TO-ACTION */}
        {client.refillLink && (isLowBalance || isOverBudget) && (
          <div
            className={`p-4 rounded-lg mb-6 flex items-center justify-between border ${isOverBudget ? "bg-red-50 border-red-100" : "bg-amber-50 border-amber-100"}`}
          >
            <div className="flex items-center gap-3">
              <AlertCircle
                size={20}
                className={isOverBudget ? "text-red-600" : "text-amber-600"}
              />
              <div>
                <p
                  className={`text-sm font-semibold ${isOverBudget ? "text-red-900" : "text-amber-900"}`}
                >
                  {isOverBudget ? "Retainer Overdrawn" : "Balance Running Low"}
                </p>
                <p
                  className={`text-xs ${isOverBudget ? "text-red-700" : "text-amber-700"}`}
                >
                  Top up your account to ensure uninterrupted work.
                </p>
              </div>
            </div>
            <a
              href={client.refillLink}
              target="_blank"
              rel="noreferrer"
              className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${isOverBudget ? "bg-red-600 hover:bg-red-700" : "bg-amber-600 hover:bg-amber-700"}`}
            >
              Refill Now
            </a>
          </div>
        )}

        {/* 4. ACTIVITY LOG */}
        <div>
          <h3 className="text-sm font-bold text-(--label) flex items-center gap-2 mb-4 uppercase tracking-wider">
            <Clock size={14} className="text-(--label)" />
            Recent Work
          </h3>

          <div className="space-y-3 max-h-100 overflow-y-auto pr-2">
            {client.logs.length === 0 ? (
              <div className="text-center py-8 bg-card rounded-lg border border-dashed border-border">
                <p className="text-sm text-(--label)">
                  No work logged for this period yet.
                </p>
              </div>
            ) : (
              client.logs
                .filter((log) => log.type !== "REFILL") // Don't show refill transactions here
                .map((log) => (
                  <div key={log.id} className={styles.logList}>
                    <div>
                      <p className={styles.logDescription}>{log.description}</p>
                      <p className={styles.logDate}>
                        {format(new Date(log.date), "MMM d, yyyy")}
                        {isThisWeek(new Date(log.date)) && (
                          <span className={styles.logDateBadge}>This Week</span>
                        )}
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <Badge variant="secondary">
                        {Number(log.hours).toFixed(2)}h
                      </Badge>

                      <DropdownMenu>
                        <DropdownMenuTrigger className="cursor-pointer" asChild>
                          <button>
                            <MoreHorizontal size={15} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" >
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => editBtnHandler(log)}
                          >
                            <Pencil size={14} /> Edit Log
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
                            Delete Log
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
