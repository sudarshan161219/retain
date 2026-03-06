import { Building2, Settings2, Loader2, User } from "lucide-react";
import { useSettings } from "@/hooks/user/useSettings";
import { WorkspaceTab } from "@/components/workspaceTab/WorkspaceTab";
import { PreferenceTab } from "@/components/preferenceTab/PreferenceTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import styles from "./index.module.css";

export const Settings = () => {
  const { settings, isLoading } = useSettings();

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
        <Tabs defaultValue="workspace">
          <TabsList variant="line">
            <TabsTrigger value="workspace" className="cursor-pointer">
              <Building2 /> Workspace
            </TabsTrigger>
            <TabsTrigger value="preferences" className="cursor-pointer">
              <Settings2 /> Preferences
            </TabsTrigger>
            <TabsTrigger value="account" className="cursor-pointer">
              <User /> Account
            </TabsTrigger>
          </TabsList>
          <TabsContent value="workspace">
            <WorkspaceTab data={settings?.workspace} />
          </TabsContent>
          <TabsContent value="preferences">
            <PreferenceTab data={settings?.preference} />
          </TabsContent>
          <TabsContent value="account">
            <div
              style={{
                padding: "1.5rem",
                fontSize: "0.875rem",
                color: "#6b7280",
              }}
            >
              Account settings coming soon.
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
