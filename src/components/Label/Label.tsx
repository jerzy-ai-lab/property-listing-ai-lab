import clsx from "clsx";
import styles from "./Label.module.css";

interface LabelProps {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}

/* Label component */
export function Label({ htmlFor, children, required, className }: LabelProps) {
  return (
    <label htmlFor={htmlFor} className={clsx(styles.label, className)}>
      {children}
      {required && <span className={styles.required}>*</span>}
    </label>
  );
}
