import { forwardRef } from "react";
import clsx from "clsx";
import styles from "./Input.module.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  variant?: "default" | "transparent";
}

/* Input component */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={clsx(styles.input, styles[variant], className)}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
