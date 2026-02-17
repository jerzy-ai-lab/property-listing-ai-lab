import { CheckCircle2 } from "lucide-react";
import styles from "./SuccessMessage.module.css";

interface SuccessMessageProps {
  title: string;
  message: string;
}

/* SuccessMessage component */
export function SuccessMessage({ title, message }: SuccessMessageProps) {
  return (
    <div className={styles.successMessage}>
      <CheckCircle2 className={styles.icon} aria-hidden="true" />
      <h2 className={styles.message}>{title}</h2>
      <p className={styles.message}>{message}</p>
    </div>
  );
}
