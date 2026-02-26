import { type FC, type ReactElement } from "react";
import { useLocation } from "react-router-dom";
import styles from "./index.module.css";

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const MainHeading: FC = (): ReactElement => {
  const location = useLocation();
  const path = location.pathname;

  let heading = "";
  let subtitle = "";

  if (path.startsWith("/dashboard/")) {
    const id = path.split("/dashboard/")[1];

    if (id && uuidRegex.test(id)) {
      heading = "Clients";
      subtitle = "Manage your active retainers.";

      console.log(heading);
    }
  } else if (path.startsWith("/reports/")) {
    const id = path.split("/reports/")[1];
    if (id && uuidRegex.test(id)) {
      heading = "Reports";
    }
  } else if (path.startsWith("/settings/")) {
    const id = path.split("/settings/")[1];
    if (id && uuidRegex.test(id)) {
      heading = "Settings";
    }
  } else {
    const pathToHeadingMap: Record<string, string> = {
      "/dashboard": "Clients",
      "/reports": "Reports",
      "/settings": "Settings",
    };

    heading = pathToHeadingMap[path] || "Page Not Found";
  }

  return (
    <div className={styles.headingContainer}>
      <h1 className={styles.mainHeading}>{heading}</h1>
      {subtitle && <p className={styles.headersubtitle}>{subtitle}</p>}
    </div>
  );
};
