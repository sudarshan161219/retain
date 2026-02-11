import { X, Loader2 } from "lucide-react";
import { useCreateClientStore } from "@/store/createClientStore/useCreateClientStore";
import { useModalStore } from "@/store/modalStore/useModalStore";
import { Button } from "../../ui/button";
import { useCreateClient } from "@/hooks/client/useCreateClient";
import styles from "./index.module.css";

export const CreateClientModal = () => {
  const { mutate, isPending } = useCreateClient();
  const { isOpen, type, closeModal } = useModalStore();
  const {
    name,
    setName,
    email,
    setEmail,
    hours,
    setHours,
    rate,
    setRate,
    currency,
    setCurrency,
    refillLink,
    setRefillLink,
  } = useCreateClientStore();

  const totalValue = Number(hours || 0) * Number(rate || 0);

  const handleCreate = () => {
    if (!name || !email || !hours)
      throw new Error("Name, Email and Hours are required");

    const totalHours = Number(hours);
    const hourlyRate = Number(rate);

    mutate({
      name,
      email,
      totalHours,
      hourlyRate,
      currency,
      refillLink,
    });
  };

  if (!isOpen || type !== "CREATE_CLIENT") return null;

  return (
    <div className={styles.overlay} onClick={closeModal}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className={styles.header}>
          <h2 className={styles.title}>Add New Client</h2>
          <button className={styles.closeBtn} onClick={closeModal}>
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className={styles.body}>
          {/* Client Name */}

          <div className={styles.row}>
            <div className={`${styles.formGroup} ${styles.col}`}>
              <label htmlFor="name" className={styles.label}>
                Client / Company Name
              </label>
              <input
                id="name"
                className={styles.input}
                placeholder="e.g. Acme Corp"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>
            <div className={`${styles.formGroup} ${styles.col}`}>
              <label htmlFor="email" className={styles.label}>
                Client Email
              </label>
              <input
                id="email"
                className={styles.input}
                placeholder="e.g. client@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          {/* Hours & Rate Row */}
          <div className={styles.row}>
            <div className={`${styles.formGroup} ${styles.col}`}>
              <label htmlFor="hours" className={styles.label}>
                Retainer Hours
              </label>
              <input
                id="hours"
                type="number"
                className={styles.input}
                placeholder="20"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
              />
            </div>
            <div className={`${styles.formGroup} ${styles.col}`}>
              <label htmlFor="hourlyRate" className={styles.label}>
                Hourly Rate
              </label>
              <div className="relative">
                <input
                  id="hourlyRate"
                  type="number"
                  className={styles.input}
                  placeholder="50"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Currency Select */}
          <div className={styles.formGroup}>
            <label htmlFor="currency" className={styles.label}>
              Currency
            </label>
            <select
              id="currency"
              className={styles.select}
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
            </select>
          </div>

          {/* Revenue Preview (Visual Feedback) */}
          <div className={styles.previewBox}>
            <span className={styles.previewLabel}>Contract Value</span>
            <span className={styles.previewValue}>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: currency,
              }).format(totalValue)}
            </span>
          </div>

          {/* Optional Refill Link */}
          <div className={styles.formGroup}>
            <label htmlFor="refillLink" className={styles.label}>
              Payment Link{" "}
              <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input
              id="refillLink"
              className={styles.input}
              placeholder="https://stripe.com/..."
              value={refillLink}
              onChange={(e) => setRefillLink(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              If left empty, will use your default global link.
            </p>
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
            onClick={handleCreate}
            disabled={!name || !hours || isPending}
          >
            {isPending && <Loader2 size={16} className="animate-spin" />}
            Create Client
          </Button>
        </div>
      </div>
    </div>
  );
};
