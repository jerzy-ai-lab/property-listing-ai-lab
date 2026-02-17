import styles from "./Divider.module.css";
import clsx from "clsx";

interface DividerProps {
  variant?: "default" | "muted" | "text";
  children?: string;
}

/* Divider component */
export function Divider({ variant = "default", children }: DividerProps) {
  return <div className={clsx(styles[variant])}>{children}</div>;
}
