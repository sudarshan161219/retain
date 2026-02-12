import { X, Loader2 } from "lucide-react";
import { useModalStore } from "@/store/modalStore/useModalStore";
import { Button } from "../../ui/button";
import { useUpdateClient } from "@/hooks/client/useUpdateClient";
import { useUpdateClientStore } from "@/store/updateClientStore/useUpdateClientStore";
import styles from "./index.module.css";

export const EditClientModal = () => {
  const { isOpen, type, closeModal } = useModalStore();
  const { mutate, isPending } = useUpdateClient();

  const { formData, setFormData } = useUpdateClientStore();

  const totalValue =
    Number(formData.totalHours || 0) * Number(formData.hourlyRate || 0);

  const handleUpdate = () => {
    if (
      !formData.id ||
      !formData.name.trim() ||
      !formData.email.trim() ||
      formData.totalHours === ""
    ) {
      throw new Error(
        "Missing required information: Name, Email, and Hours are mandatory.",
      );
    }

    mutate(formData);
  };

  if (!isOpen || type !== "EDIT_CLIENT") return null;

  return (
    <div className={styles.overlay} onClick={closeModal}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className={styles.header}>
          <h2 className={styles.title}>Edit Client</h2>
          <button className={styles.closeBtn} onClick={closeModal}>
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className={styles.body}>
          {/* Client Name & Email */}
          <div className={styles.row}>
            <div className={`${styles.formGroup} ${styles.col}`}>
              <label htmlFor="edit-name" className={styles.label}>
                Client / Company Name
              </label>
              <input
                id="edit-name"
                className={styles.input}
                placeholder="e.g. Acme Corp"
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                autoFocus
              />
            </div>
            <div className={`${styles.formGroup} ${styles.col}`}>
              <label htmlFor="edit-email" className={styles.label}>
                Client Email
              </label>
              <input
                id="edit-email"
                className={styles.input}
                placeholder="e.g. client@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ email: e.target.value })}
              />
            </div>
          </div>

          {/* Hours & Rate Row */}
          <div className={styles.row}>
            <div className={`${styles.formGroup} ${styles.col}`}>
              <label htmlFor="edit-hours" className={styles.label}>
                Retainer Hours
              </label>
              <input
                id="edit-hours"
                type="number"
                className={styles.input}
                placeholder="20"
                value={formData.totalHours}
                onChange={(e) =>
                  setFormData({ totalHours: Number(e.target.value) })
                }
              />
            </div>
            <div className={`${styles.formGroup} ${styles.col}`}>
              <label htmlFor="edit-hourlyRate" className={styles.label}>
                Hourly Rate
              </label>
              <div className="relative">
                <input
                  id="edit-hourlyRate"
                  type="number"
                  className={styles.input}
                  placeholder="50"
                  value={formData.hourlyRate}
                  onChange={(e) =>
                    setFormData({ hourlyRate: Number(e.target.value) })
                  }
                />
              </div>
            </div>
          </div>

          {/* Currency Select */}
          <div className={styles.formGroup}>
            <label htmlFor="edit-currency" className={styles.label}>
              Currency
            </label>
            <select
              id="edit-currency"
              className={styles.select}
              value={formData.currency}
              onChange={(e) => setFormData({ currency: e.target.value })}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
            </select>
          </div>

          {/* Revenue Preview */}
          <div className={styles.previewBox}>
            <span className={styles.previewLabel}>Contract Value</span>
            <span className={styles.previewValue}>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: formData.currency,
              }).format(totalValue)}
            </span>
          </div>

          {/* Optional Refill Link */}
          <div className={styles.formGroup}>
            <label htmlFor="edit-refillLink" className={styles.label}>
              Payment Link{" "}
              <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input
              id="edit-refillLink"
              className={styles.input}
              placeholder="https://stripe.com/..."
              value={formData.refillLink ?? ""}
              onChange={(e) => setFormData({ refillLink: e.target.value })}
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className={styles.footer}>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={closeModal}
          >
            Cancel
          </Button>

          <Button
            variant="default"
            className="cursor-pointer"
            onClick={handleUpdate}
            // disabled={!name || !hours || isPending}
          >
            {isPending && <Loader2 size={16} className="animate-spin mr-2" />}
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};
