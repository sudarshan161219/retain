import styles from "./index.module.css";

export const Header = () => {
  return (
    <div className={styles.header}>
      <div>
        <h1 className={styles.headertitle}>Clients</h1>
        <p className={styles.headersubtitle}>Manage your active retainers.</p>
      </div>

    </div>
  );
};
