import { useModalStore } from "@/store/modalStore/useModalStore";
import { ExportModal } from "../exportModal/ExportModal";
import { RefillModal } from "../refillModal/RefillModal";
import { WarningModal } from "../WarningModal/WarningModal";
import { CreateClientModal } from "../createClientModal/CreateClientModal";
import { EditClientModal } from "../editClientModal/EditClientModal";
import { SearchFilterModal } from "../searchFilterModal/SearchFilterModal";
import { QuickLogModal } from "../quickLogModal/QuickLogModal";

export const ModalManager = () => {
  const { isOpen, type } = useModalStore();

  if (!isOpen) return null;

  switch (type) {
    case "EXPORT_REPORT":
      return <ExportModal />;

    case "REFILL_BALANCE":
      return <RefillModal />;

    case "WARNING":
      return <WarningModal />;

    case "CREATE_CLIENT":
      return <CreateClientModal />;

    case "EDIT_CLIENT":
      return <EditClientModal />;

    case "SEARCH_FILTERS":
      return <SearchFilterModal />;

    case "QUICK_LOG":
      return <QuickLogModal />;

    default:
      return null;
  }
};
