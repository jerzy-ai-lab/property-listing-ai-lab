import type { LucideIcon } from "lucide-react";
import styles from "./IconCard.module.css";

export type IconCardItem = {
  icon: LucideIcon;
  title: string;
  description: string;
};

interface IconCardProps {
  item: IconCardItem;
}

/* IconCard component */
export function IconCard({ item }: IconCardProps) {
  const Icon = item.icon;

  return (
    <div className={styles.card}>
      <div className={styles.iconWrapper}>
        <Icon className={styles.icon} />
      </div>
      <h3 className={styles.title}>{item.title}</h3>
      <p className={styles.description}>{item.description}</p>
    </div>
  );
}
