import { Building2, Loader2, User } from "lucide-react";
import { useSettings } from "@/hooks/user/useSettings";
import { AccountSettings } from "@/components/settingsTabs/accountSettingsTab/AccountSettings";
import { WorkspaceTab } from "@/components/settingsTabs/workspaceTab/WorkspaceTab";

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
            <TabsTrigger value="account" className="cursor-pointer">
              <User /> Account
            </TabsTrigger>
          </TabsList>
          <TabsContent value="workspace">
            <WorkspaceTab data={settings?.workspace} />
          </TabsContent>

          <TabsContent value="account">
            <AccountSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
