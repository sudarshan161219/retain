import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useModalStore } from "@/store/modalStore/useModalStore";
import { useSettings } from "@/hooks/user/useSettings";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ALLOWED_FORMATS } from "@/constants/dateFormats";
import { useThemeStore } from "@/store/theme/useThemeStore";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

import styles from "./index.module.css";

// Generate the list of all global timezones natively
const ALL_TIMEZONES = Intl.supportedValuesOf("timeZone");

export const PreferenceModal = () => {
  const { isOpen, type, closeModal } = useModalStore();
  const { settings, updatePreference } = useSettings();
  const { theme, setTheme } = useThemeStore();
  const [dateFormat, setDateFormat] = useState("MMM d, yyyy");
  const [timezone, setTimezone] = useState("");

  // Sync state when the modal opens or settings load
  useEffect(() => {
    if (settings?.preference) {
      setDateFormat(settings.preference.dateFormat || "MMM d, yyyy");

      // Fallback to the user's local browser timezone if they haven't set one
      setTimezone(
        settings.preference.timezone ||
          Intl.DateTimeFormat().resolvedOptions().timeZone,
      );
    }
  }, [settings, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePreference.mutate(
      { dateFormat, timezone },
      {
        onSuccess: () => {
          closeModal();
        },
      },
    );
  };

  if (!isOpen || type !== "PREFERENCES") return null;

  return (
    <div className={styles.overlay} onClick={closeModal}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>App Preferences</h2>
            <p className={styles.subtitle}>Customize your local experience.</p>
          </div>
          <button onClick={closeModal} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <form onSubmit={handleSubmit}>
          <div className={styles.body}>
            <div className={styles.formGroup}>
              <Label htmlFor="theme" className={styles.label}>
                Theme
              </Label>

              <div id="theme" className={styles.themeToggle}>
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
              <Label htmlFor="date-format" className={styles.label}>
                Date Format
              </Label>
              <select
                id="date-format"
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
              <Label htmlFor="timezone" className={styles.label}>
                Timezone
              </Label>

              <Combobox id="timezone" items={ALL_TIMEZONES || []}>
                <ComboboxInput placeholder="Select Client" />
                <ComboboxContent className={styles.ComboboxContent}>
                  <ComboboxEmpty>No items found.</ComboboxEmpty>
                  <ComboboxList>
                    {(zone) => (
                      <ComboboxItem
                        key={zone}
                        value={zone}
                        className={styles.ComboboxItem}
                        onClick={() => setTimezone(zone)}
                      >
                        {zone.replace(/_/g, " ")}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>
          </div>

          {/* FOOTER */}
          <div className={styles.footer}>
            <Button
              className="cursor-pointer"
              type="button"
              variant="outline"
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updatePreference.isPending}
              className="cursor-pointer"
            >
              {updatePreference.isPending && (
                <Loader2 className="animate-spin mr-2" size={16} />
              )}
              Save Preferences
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
