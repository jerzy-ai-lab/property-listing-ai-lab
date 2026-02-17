import clsx from "clsx";
import styles from "./FormError.module.css";

type FormErrorVariant = "default" | "center";

interface FormErrorProps {
  error?: string;
  variant?: FormErrorVariant;
  className?: string;
}

/* FormError component */
export function FormError({
  error,
  variant = "default",
  className,
}: FormErrorProps) {
  return (
    <div className={clsx(styles.error, styles[variant], className)}>
      {error || ""}
    </div>
  );
}
