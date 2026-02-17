import clsx from "clsx";
import styles from "./PageHeader.module.css";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  variant?: "left" | "center";
}

/* PageHeader component */
export function PageHeader({
  title,
  subtitle,
  variant = "center",
}: PageHeaderProps) {
  return (
    <div className={styles.header}>
      <h1 className={clsx(styles.title, styles[variant])}>{title}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
}
