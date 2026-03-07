import React, { useState, useEffect } from "react";
import { User as UserIcon, Mail, AlertTriangle, Loader2 } from "lucide-react";
import { useUser } from "@/hooks/user/useUser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import styles from "./index.module.css";

export const AccountSettings = () => {
  const { data: initialUser, isLoading: isUserLoading } = useUser();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
  });

  // Sync state when data loads
  useEffect(() => {
    if (initialUser) {
      setFormData({
        name: initialUser.name || "",
      });
    }
  }, [initialUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API Call
    setTimeout(() => {
      console.log("Saving settings:", formData);
      setIsSaving(false);
    }, 1000);
  };

  if (isUserLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-label" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* --- PROFILE SECTION --- */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Profile Information</h2>
            <p className={styles.sectionDesc}>
              Your personal identity on Retain.
            </p>
          </div>

          <div className={styles.avatarRow}>
            <div className={styles.avatarCircle}>
              {initialUser?.avatar ? (
                <img
                  src={initialUser.avatar}
                  alt="Avatar"
                  className={styles.avatarImg}
                />
              ) : (
                <UserIcon size={32} className="text-background" />
              )}
            </div>
            <div>
              <Button
                className="cursor-pointer"
                type="button"
                variant="outline"
                size="sm"
              >
                Change Avatar
              </Button>
            </div>
          </div>

          <div className={styles.grid2}>
            <div className={styles.formGroup}>
              <Label htmlFor="name" className={styles.label}>
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Sudarshan"
              />
            </div>

            <div className={styles.formGroup}>
              <Label htmlFor="email" className={styles.label}>
                <Mail size={14} /> Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={initialUser?.email || ""}
                disabled
                className="bg-gray-50 text-label cursor-not-allowed"
              />
              <p className={styles.helperText}>
                Managed via your <strong>{initialUser?.provider}</strong>{" "}
                provider.
              </p>
            </div>
          </div>
        </section>

        <hr className={styles.divider} />

        {/* --- INTEGRATIONS SECTION --- */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Connected Accounts</h2>
            <p className={styles.sectionDesc}>Manage your OAuth logins.</p>
          </div>

          <div className={styles.integrationsBox}>
            <div className={styles.integrationItem}>
              <div className="flex items-center gap-3">
                <div className={styles.integrationIcon}>G</div>
                <div>
                  <p className={styles.integrationName}>Google</p>
                  <p className={styles.integrationStatus}>
                    {initialUser?.googleId ? "Connected" : "Not connected"}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="cursor-pointer"
                disabled={!!initialUser?.googleId}
              >
                {initialUser?.googleId ? "Active" : "Connect"}
              </Button>
            </div>

            <div className={styles.integrationItem}>
              <div className="flex items-center gap-3">
                <div className={styles.integrationIcon}>GH</div>
                <div>
                  <p className={styles.integrationName}>GitHub</p>
                  <p className={styles.integrationStatus}>
                    {initialUser?.githubId ? "Connected" : "Not connected"}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="cursor-pointer"
                disabled={!!initialUser?.githubId}
              >
                {initialUser?.githubId ? "Active" : "Connect"}
              </Button>
            </div>
          </div>
        </section>

        {/* --- FOOTER ACTIONS --- */}
        <div className={styles.footer}>
          <Button type="submit" disabled={isSaving} className="cursor-pointer">
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>

      {/* --- DANGER ZONE --- */}
      <section className={styles.dangerZone}>
        <div className={styles.dangerInfo}>
          <h3 className={styles.dangerTitle}>
            <AlertTriangle size={16} className="text-red-600" />
            Delete Account
          </h3>
          <p className={styles.dangerDesc}>
            Permanently delete your account and all associated client data. This
            action cannot be undone.
          </p>
        </div>
        <Button
          variant="destructive"
          className="bg-red-600 hover:bg-red-700 w-full"
        >
          Delete Account
        </Button>
      </section>
    </div>
  );
};
