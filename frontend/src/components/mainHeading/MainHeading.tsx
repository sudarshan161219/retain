import {
  useState,
  useEffect,
  type FC,
  type ReactElement,
  useEffectEvent,
} from "react";
import { useLocation } from "react-router-dom";
import styles from "./index.module.css";

export const MainHeading: FC = (): ReactElement => {
  const location = useLocation();
  const [heading, setHeading] = useState("Overview");

  const updateHeading = useEffectEvent((text: string) => {
    setHeading(text);
  });

  useEffect(() => {
    const path = location.pathname;

    if (path.startsWith("/dashboard/")) {
      const id = path.split("/dashboard/")[1];
      if (id && /^\d+$/.test(id)) {
        updateHeading("Overview");
        return;
      }
    }

    if (path.startsWith("/reports/")) {
      const id = path.split("/reports/")[1];
      if (id && /^\d+$/.test(id)) {
        updateHeading("Reports");
        return;
      }
    }

    if (path.startsWith("/settings/")) {
      const id = path.split("/settings/")[1];
      if (id && /^\d+$/.test(id)) {
        updateHeading("settings");
        return;
      }
    }

    const pathToHeadingMap: Record<string, string> = {
      "/dashboard": "Overview",
      "/reports": "Clients",
      "/settings": "Invoices",
    };

    const title = pathToHeadingMap[location.pathname] || "Overview";
    updateHeading(title);
  }, [heading, location.pathname]);

  return (
    <div className={styles.headingContainer}>
      <h1 className={styles.mainHeading}>{heading}</h1>
    </div>
  );
};
