import { useState } from "react";
import { X, Loader2, AlertTriangle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useModalStore } from "@/store/modalStore/useModalStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/api/api";
import { toast } from "sonner";
import { DatePicker } from "@/components/datePicker/DatePicker";
import { useEditLogStore } from "@/store/client/editLogStore/useEditLogStore";
import styles from "./index.module.css";
import { useDateStore } from "@/store/dateStore/useDateStore";

export const EditLogModal = () => {
  const { isOpen, type, closeModal } = useModalStore();
  const { date } = useDateStore();
  const { selectedLog, setSelectedLog, clearSelectedLog } = useEditLogStore();
  const queryClient = useQueryClient();

  // We only need local state for UI transitions now
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  // Clean close handler
  const handleClose = () => {
    closeModal();
    // Wait for the fade-out animation before wiping data
    setTimeout(() => {
      clearSelectedLog();
      setIsConfirmingDelete(false);
    }, 200);
  };

  // --- MUTATION: UPDATE LOG ---
  const { mutate: updateLog, isPending: isUpdating } = useMutation({
    mutationFn: async () => {
      return api.put(`/work-logs/${selectedLog?.id}`, {
        hours: Number(selectedLog?.hours),
        description: selectedLog?.description,
        date: new Date(date).toISOString(),
      });
    },
    onSuccess: () => {
      toast.success("Log updated successfully");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      handleClose();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update log");
    },
  });

  // --- MUTATION: DELETE LOG ---
  const { mutate: deleteLog, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      return api.delete(`/work-logs/${selectedLog?.id}`);
    },
    onSuccess: () => {
      toast.success("Log deleted. Hours returned to client balance.");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      handleClose();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to delete log");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateLog();
  };

  if (!isOpen || type !== "EDIT_LOG" || !selectedLog) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            {isConfirmingDelete ? "Delete Time Log?" : "Edit Time Log"}
          </h2>
          <button onClick={handleClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        {/* CONDITIONAL BODY: Edit Form vs Delete Confirmation */}
        {!isConfirmingDelete ? (
          /* --- EDIT FORM --- */
          <form onSubmit={handleSubmit}>
            <div className={styles.body}>
              <div className={styles.row}>
                <div className={styles.col}>
                  <Label htmlFor="edit-hours">Hours</Label>
                  <Input
                    id="edit-hours"
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={selectedLog.hours}
                    className={styles.input}
                    onChange={(e) =>
                      setSelectedLog({
                        ...selectedLog,
                        hours: Number(e.target.value),
                      })
                    }
                    required
                  />
                </div>
                <div className={styles.col}>
                  <DatePicker />
                </div>
              </div>

              <div className={styles.formGroup}>
                <Label htmlFor="edit-desc">Description</Label>
                <Textarea
                  id="edit-desc"
                  rows={3}
                  value={selectedLog.description}
                  onChange={(e) =>
                    setSelectedLog({
                      ...selectedLog,
                      description: e.target.value,
                    })
                  }
                  required
                  className={styles.description}
                />
              </div>
            </div>

            {/* FOOTER ACTIONS */}
            <div className={styles.footer}>
              <div className={styles.footerActions}>
                <Button
                  className="cursor-pointer"
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="cursor-pointer"
                >
                  {isUpdating && (
                    <Loader2 className="animate-spin mr-2" size={16} />
                  )}
                  Save Changes
                </Button>
              </div>
            </div>
          </form>
        ) : (
          /* --- DELETE CONFIRMATION STATE --- */
          <div className={styles.dangerZone}>
            <div className={styles.dangerBody}>
              <div className={styles.dangerIconWrapper}>
                <AlertTriangle size={24} />
              </div>
              <h3 className={styles.dangerTitle}>Are you absolutely sure?</h3>
              <p className={styles.dangerText}>
                This will permanently delete the log for{" "}
                <strong>"{selectedLog.description}"</strong>.
              </p>
              <p className={styles.dangerSubtext}>
                {selectedLog.hours} hours will be returned to the client's
                balance.
              </p>
            </div>

            <div className={styles.dangerFooter}>
              <Button
                type="button"
                variant="outline"
                className={styles.flex1}
                onClick={() => setIsConfirmingDelete(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                className={`${styles.flex1} bg-red-600 hover:bg-red-700`}
                onClick={() => deleteLog()}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="animate-spin mr-2" size={16} />
                ) : (
                  "Yes, Delete Log"
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
