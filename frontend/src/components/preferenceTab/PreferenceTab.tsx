import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useSettings } from "@/hooks/user/useSettings";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ALLOWED_FORMATS } from "@/constants/dateFormats";
import styles from "./index.module.css";

export const PreferenceTab = ({ data }: { data: any }) => {
  const { updatePreference } = useSettings();
  const [dateFormat, setDateFormat] = useState("MMM d, yyyy");
  const [timezone, setTimezone] = useState("UTC");

  useEffect(() => {
    if (data) {
      setDateFormat(data.dateFormat || "MMM d, yyyy");
      setTimezone(data.timezone || "UTC");
    }
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePreference.mutate({ dateFormat, timezone });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>App Preferences</h2>
        <p className={styles.sectionDesc}>
          Customize how data is formatted and displayed across the app.
        </p>
      </div>

      <div className={styles.grid2} style={{ maxWidth: "28rem" }}>
        <div className={styles.formGroup}>
          <Label>Date Format</Label>
          <select
            value={dateFormat}
            onChange={(e) => setDateFormat(e.target.value)}
            className={styles.select}
          >
            {ALLOWED_FORMATS.map((fmt) => (
              <option key={fmt.value} value={fmt.value}>
                {fmt.label}
              </option>
            ))}
          </select>
          <p className={styles.previewText}>
            Preview:{" "}
            <span className={styles.previewHighlight}>
              {format(new Date(), dateFormat)}
            </span>
          </p>
        </div>

        <div className={styles.formGroup}>
          <Label>Timezone</Label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className={styles.select}
          >
            <option value="UTC">UTC (Universal Coordinated Time)</option>
            <option value="Asia/Kolkata">IST (Indian Standard Time)</option>
            <option value="America/New_York">
              EST (Eastern Standard Time)
            </option>
          </select>
        </div>
      </div>

      <div className={styles.footer}>
        <Button
          type="submit"
          disabled={updatePreference.isPending}
          className={styles.submitBtn}
        >
          {updatePreference.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Save Preferences
        </Button>
      </div>
    </form>
  );
};
