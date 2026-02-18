import { useEffect } from "react";
import {
  Search,
  Download,
  Plus,
  Clock,
  ArrowUpAZ,
  ArrowDownAZ,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModalStore } from "@/store/modalStore/useModalStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import styles from "./index.module.css";

interface ToolbarProps {
  currentStatus: string;
  onStatusChange: (value: string) => void;
  sortOrder: "ASC" | "DESC";
  onSortChange: (order: "ASC" | "DESC") => void;
  onExport: () => void;
}

export const Toolbar = ({
  currentStatus = "ACTIVE",
  onStatusChange,
  sortOrder,
  onSortChange,
  onExport,
}: ToolbarProps) => {
  const { openModal, isOpen } = useModalStore();

  // Handle Cmd+K Shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        openModal("SEARCH_FILTERS");
      }

      console.log(e.key);
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isOpen, openModal]);

  return (
    <div className={styles.wrapper}>
      {/* Left: Actions */}
      <div className={styles.leftActions}>
        <button
          className={styles.searchTrigger}
          onClick={() => openModal("SEARCH_FILTERS")}
          aria-label="Search clients"
        >
          <Search size={16} />
          <span className={styles.searchText}>Search clients...</span>
          <kbd className={styles.shortcut}>⌘K</kbd>
        </button>

        <div className="w-35 hidden sm:block">
          <Select value={currentStatus} onValueChange={onStatusChange}>
            <SelectTrigger className="cursor-pointer">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="PAUSED">Paused</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 cursor-pointer"
          onClick={() => onSortChange(sortOrder === "ASC" ? "DESC" : "ASC")}
          title={`Sort ${sortOrder === "ASC" ? "Descending" : "Ascending"}`}
        >
          {sortOrder === "ASC" ? (
            <ArrowUpAZ size={16} />
          ) : (
            <ArrowDownAZ size={16} />
          )}
        </Button>
      </div>

      {/* RIGHT: Actions */}
      <div className={styles.actions}>
        {/* Quick Actions */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => openModal("QUICK_LOG")}
          title="Quick Log Time"
          className="cursor-pointer"
        >
          <Clock size={18} />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={onExport}
          title="Export CSV"
          className={styles.hideOnMobile}
        >
          <Download size={18} />
        </Button>

        {/* Primary Action */}
        <Button
          onClick={() => openModal("CREATE_CLIENT")}
          className="cursor-pointer"
        >
          <Plus size={18} className=" hidden sm:block" />
          <span className="hidden sm:inline">New Client</span>
          <Plus size={18} className="sm:hidden" />
        </Button>
      </div>
    </div>
  );
};
