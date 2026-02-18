import { useState, useMemo } from "react";
import { X, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useModalStore } from "@/store/modalStore/useModalStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

import api from "@/lib/api/api";
import { toast } from "sonner";
import styles from "./index.module.css";
import { useGetAllClients } from "@/hooks/client/useGetAllClients";

export type Client = {
  id: string;
  userId: string;
  slug: string;
  name: string;
  email: string;

  status: "ACTIVE" | "INACTIVE" | "ARCHIVED";

  refillLink: string | null;

  totalHours: string;
  hoursLogged: string;
  hourlyRate: string;

  currency: string;

  createdAt: string;
  updatedAt: string;
  lastLogAt: string | null;

  hoursRemaining: number;
};

export const QuickLogModal = () => {
  const { isOpen, type, closeModal } = useModalStore();
  const queryClient = useQueryClient();
  const { data: clients, isLoading } = useGetAllClients();
  // Form State
  const [clientId, setClientId] = useState("");
  const [hours, setHours] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Default Today

  // 1. Filter Active Clients for Dropdown
  const filteredData = useMemo(() => {
    if (!clients?.length) return [];

    const result = [];

    for (const client of clients) {
      if (client.status !== "ACTIVE") continue;

      const total = Number(client.totalHours) || 0;
      const logged = Number(client.hoursLogged) || 0;

      result.push({
        ...client,
        hoursRemaining: Math.max(total - logged, 0),
      });
    }

    return result;
  }, [clients]);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!clientId) throw new Error("Please select a client");

      return api.post(`/work-logs`, {
        clientId,
        hours: Number(hours),
        description,
        date: new Date(date).toISOString(),
        type: "WORK",
      });
    },
    onSuccess: () => {
      toast.success("Time logged successfully!");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["recent-logs"] });

      handleClose();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to log time");
    },
  });

  const handleClose = () => {
    setClientId("");
    setHours("");
    setDescription("");
    setDate(new Date().toISOString().split("T")[0]);
    closeModal();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate();
  };

  if (!isOpen || type !== "QUICK_LOG") return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className={styles.header}>
          <h2 className={styles.title}>Quick Log Time</h2>
          <button className={styles.closeBtn} onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.body}>
          {/* Client Selector */}
          <div className={styles.formGroup}>
            <Label className={styles.label} htmlFor="client">
              Client
            </Label>
            {isLoading ? (
              <span>please wait...</span>
            ) : (
              <Combobox id="client" items={filteredData || []}>
                <ComboboxInput placeholder="Select Client" />
                <ComboboxContent className={styles.ComboboxContent}>
                  <ComboboxEmpty>No items found.</ComboboxEmpty>
                  <ComboboxList>
                    {(client: Client) => (
                      <ComboboxItem
                        key={client.id}
                        value={client.name}
                        className={styles.ComboboxItem}
                        onClick={() => setClientId(client.id)}
                      >
                        <span className="font-medium text-(--label)">
                          {client.name}
                        </span>
                        <span className="text-xs text-(--label)">
                          {client.hoursRemaining} hrs remaining
                        </span>
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            )}
          </div>

          <div className={styles.row}>
            {/* Hours Input */}
            <div className={`${styles.formGroup} ${styles.col}`}>
              <Label className={styles.label} htmlFor="hours">
                Hours
              </Label>
              <Input
                id="hours"
                type="number"
                step="0.1"
                min="0.1"
                placeholder="e.g. 1.5"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                required
              />
            </div>

            {/* Date Picker */}
            <div className={`${styles.formGroup} ${styles.col}`}>
              <Label className={styles.label} htmlFor="date">
                Date
              </Label>
              <div className="relative">
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className={styles.formGroup}>
            <Label className={styles.label} htmlFor="description">
              Description
            </Label>
            <textarea
              id="description"
              className={styles.textarea}
              placeholder="What did you work on?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
            />
          </div>

          {/* FOOTER */}
          <div className={styles.footer}>
            <Button
              className="cursor-pointer"
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              className="cursor-pointer"
              type="submit"
              disabled={!clientId || !hours || isPending}
            >
              {isPending && <Loader2 className="animate-spin mr-2" size={16} />}
              Log Time
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
