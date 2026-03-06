import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useSettings } from "@/hooks/user/useSettings";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ALLOWED_FORMATS } from "@/constants/dateFormats";
import { useThemeStore } from "@/store/theme/useThemeStore";
import styles from "./index.module.css";

export const PreferenceTab = ({ data }: { data: any }) => {
  const { updatePreference } = useSettings();
  const { theme, setTheme } = useThemeStore();
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
          <Label className={styles.label}>Theme</Label>

          <div className={styles.themeToggle}>
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`${styles.themeBtn} ${
                theme === "light" ? styles.themeActive : ""
              }`}
            >
              Light
            </button>

            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`${styles.themeBtn} ${
                theme === "dark" ? styles.themeActive : ""
              }`}
            >
              Dark
            </button>

            <button
              type="button"
              onClick={() => setTheme("system")}
              className={`${styles.themeBtn} ${
                theme === "system" ? styles.themeActive : ""
              }`}
            >
              System
            </button>
          </div>
        </div>

        <div className={styles.formGroup}>
          <Label htmlFor="date" className={styles.label}>
            Date Format
          </Label>

          <Select value={dateFormat} onValueChange={(e) => setDateFormat(e)}>
            <SelectTrigger id="date" className="w-full cursor-pointer">
              <SelectValue placeholder="Date Formats" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Date Formats</SelectLabel>
                {ALLOWED_FORMATS.map((fmt) => (
                  <SelectItem
                    className="cursor-pointer"
                    key={fmt.value}
                    value={fmt.value}
                  >
                    {fmt.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <p className={styles.previewText}>
            Preview:{" "}
            <span className={styles.previewHighlight}>
              {format(new Date(), dateFormat)}
            </span>
          </p>
        </div>

        <div className={styles.formGroup}>
          <Label htmlFor="timezone" className={styles.label}>
            Timezone
          </Label>
   

          <Select value={timezone} onValueChange={(e) => setTimezone(e)}>
            <SelectTrigger id="Timezone" className="w-full cursor-pointer">
              <SelectValue placeholder=" Timezone" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel> Timezones</SelectLabel>
                <SelectItem className="cursor-pointer" value="UTC">
                  UTC (Universal Coordinated Time)
                </SelectItem>
                <SelectItem className="cursor-pointer" value="Asia/Kolkata">
                  IST (Indian Standard Time)
                </SelectItem>
                <SelectItem className="cursor-pointer" value="America/New_York">
                  EST (Eastern Standard Time)
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
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
