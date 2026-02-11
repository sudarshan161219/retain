import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useModalStore } from "@/store/modalStore/useModalStore";
import styles from "./index.module.css";

export const Header = () => {
  const { openModal } = useModalStore();
  return (
    <div className={styles.header}>
      <div>
        <h1 className={styles.headertitle}>Clients</h1>
        <p className={styles.headersubtitle}>Manage your active retainers.</p>
      </div>
      <Button
        onClick={() => openModal("CREATE_CLIENT")}
        className="cursor-pointer"
        variant="default"
      >
        <Plus size={16} className={styles.buttonicon} />
        Add Client
      </Button>
    </div>
  );
};
