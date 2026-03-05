import { useState } from "react";
import { Building2, Settings2, Loader2, User } from "lucide-react";
import { useSettings } from "@/hooks/user/useSettings";
import { WorkspaceTab } from "@/components/workspaceTab/WorkspaceTab";
import { PreferenceTab } from "@/components/preferenceTab/PreferenceTab";
import styles from "./index.module.css";

type Tab = "workspace" | "preferences" | "account";

export const Settings = () => {
  const { settings, isLoading } = useSettings();
  const [activeTab, setActiveTab] = useState<Tab>("workspace");

  if (isLoading) {
    return (
      <div className={styles.loadingWrapper}>
        <Loader2 className="animate-spin" size={24} />
      </div>
    );
  }

  return (
    <div className={styles.container}>


      <div className={styles.layout}>
        {/* SIDEBAR NAVIGATION */}
        <nav className={styles.sidebar}>
          <button
            onClick={() => setActiveTab("workspace")}
            className={`${styles.navButton} ${activeTab === "workspace" ? styles.navButtonActive : styles.navButtonInactive}`}
          >
            <Building2 size={16} /> Workspace
          </button>

          <button
            onClick={() => setActiveTab("preferences")}
            className={`${styles.navButton} ${activeTab === "preferences" ? styles.navButtonActive : styles.navButtonInactive}`}
          >
            <Settings2 size={16} /> Preferences
          </button>

          <button
            onClick={() => setActiveTab("account")}
            className={`${styles.navButton} ${activeTab === "account" ? styles.navButtonActive : styles.navButtonInactive}`}
          >
            <User size={16} /> Account
          </button>
        </nav>

        {/* TAB CONTENT AREA */}
        <div className={styles.contentArea}>
          {activeTab === "workspace" && (
            <WorkspaceTab data={settings?.workspace} />
          )}
          {activeTab === "preferences" && (
            <PreferenceTab data={settings?.preference} />
          )}
          {activeTab === "account" && (
            <div
              style={{
                padding: "1.5rem",
                fontSize: "0.875rem",
                color: "#6b7280",
              }}
            >
              Account settings coming soon.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
