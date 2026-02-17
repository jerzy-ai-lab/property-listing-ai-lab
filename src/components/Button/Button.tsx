import clsx from "clsx";
import styles from "./Button.module.css";

interface ButtonProps {
  children: React.ReactNode;
  variant?:
    | "primary"
    | "secondary"
    | "filter"
    | "active"
    | "closeCircle"
    | "danger";
  className?: string;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  "aria-pressed"?: boolean;
  disabled?: boolean;
}

/* Button component */
export function Button({
  children,
  variant = "primary",
  className,
  onClick,
  type = "button",
  disabled = false,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(styles.button, styles[variant], className)}
      {...rest}
    >
      {children}
    </button>
  );
}
