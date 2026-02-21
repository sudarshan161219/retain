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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import styles from "./index.module.css";
import { useToolbarStore } from "@/store/toolbarStore/useToolbarStore";

export const Toolbar = () => {
  const { openModal, isOpen } = useModalStore();
  const { currentStatus, onStatusChange, sortOrder, onSortChange } =
    useToolbarStore();

  // Handle Ctrl+K Shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        openModal("SEARCH_FILTERS");
      }
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
            <SelectTrigger className="w-full cursor-pointer">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                <SelectItem className="cursor-pointer" value="ALL">
                  All
                </SelectItem>
                <SelectItem className="cursor-pointer" value="ACTIVE">
                  Active
                </SelectItem>
                <SelectItem className="cursor-pointer" value="PAUSED">
                  Paused
                </SelectItem>
                <SelectItem className="cursor-pointer" value="ARCHIVED">
                  Archived
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 cursor-pointer"
          onClick={() => onSortChange(sortOrder === "asc" ? "desc" : "asc")}
          title={`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
        >
          {sortOrder === "asc" ? (
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
          // onClick={onExport}
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
