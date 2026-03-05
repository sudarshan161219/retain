import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useSettings } from "@/hooks/user/useSettings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import styles from "./index.module.css";

export const WorkspaceTab = ({ data }: { data: any }) => {
  const { updateWorkspace } = useSettings();
  const [formData, setFormData] = useState({
    businessName: "",
    logoUrl: "",
    taxId: "",
    defaultHourlyRate: "",
    defaultCurrency: "USD",
    defaultRefillLink: "",
  });

  useEffect(() => {
    if (data) {
      setFormData({
        businessName: data.businessName || "",
        logoUrl: data.logoUrl || "",
        taxId: data.taxId || "",
        defaultHourlyRate: data.defaultHourlyRate || "",
        defaultCurrency: data.defaultCurrency || "USD",
        defaultRefillLink: data.defaultRefillLink || "",
      });
    }
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateWorkspace.mutate({
      ...formData,
      defaultHourlyRate: formData.defaultHourlyRate ? Number(formData.defaultHourlyRate) : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Workspace Details</h2>
        <p className={styles.sectionDesc}>This information appears on your client-facing portals.</p>
      </div>

      <div className={styles.grid2}>
        <div className={styles.formGroup}>
          <Label>Business / Agency Name</Label>
          <Input 
            value={formData.businessName} 
            onChange={e => setFormData({...formData, businessName: e.target.value})} 
            placeholder="e.g. NodeDev Studio" 
          />
        </div>
        <div className={styles.formGroup}>
          <Label>Logo URL</Label>
          <Input 
            value={formData.logoUrl} 
            onChange={e => setFormData({...formData, logoUrl: e.target.value})} 
            placeholder="https://..." 
          />
        </div>
        <div className={styles.formGroup}>
          <Label>Tax ID / VAT</Label>
          <Input 
            value={formData.taxId} 
            onChange={e => setFormData({...formData, taxId: e.target.value})} 
            placeholder="Optional" 
          />
        </div>
      </div>

      <hr className={styles.divider} />

      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Retainer Defaults</h2>
        <p className={styles.sectionDesc}>Pre-fills when creating a new client.</p>
      </div>

      <div className={styles.grid3}>
        <div className={styles.formGroup}>
          <Label>Default Hourly Rate</Label>
          <Input 
            type="number" 
            value={formData.defaultHourlyRate} 
            onChange={e => setFormData({...formData, defaultHourlyRate: e.target.value})} 
          />
        </div>
        <div className={styles.formGroup}>
          <Label>Currency</Label>
          <Input 
            value={formData.defaultCurrency} 
            onChange={e => setFormData({...formData, defaultCurrency: e.target.value.toUpperCase()})} 
            maxLength={3}
          />
        </div>
        <div className={`${styles.formGroup} ${styles.colSpan3}`}>
          <Label>Default Refill Link (Stripe/PayPal)</Label>
          <Input 
            value={formData.defaultRefillLink} 
            onChange={e => setFormData({...formData, defaultRefillLink: e.target.value})} 
            placeholder="https://buy.stripe.com/..." 
          />
        </div>
      </div>

      <div className={styles.footer}>
        <Button type="submit" disabled={updateWorkspace.isPending} className={styles.submitBtn}>
          {updateWorkspace.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Workspace
        </Button>
      </div>
    </form>
  );
};