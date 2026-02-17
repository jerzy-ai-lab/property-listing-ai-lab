import { useState, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";
import clsx from "clsx";
import { Input } from "@/components/Input/Input";
import styles from "./PasswordInput.module.css";

interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  className?: string;
}

/* PasswordInput component */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    return (
      <div className={styles.passwordInput}>
        <Input
          ref={ref}
          type={showPassword ? "text" : "password"}
          className={clsx(styles.passwordInput, className)}
          {...props}
        />
        <button
          type="button"
          className={styles.toggleButton}
          onClick={togglePasswordVisibility}
          onMouseDown={(e) => e.preventDefault()}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className={styles.icon} aria-hidden="true" />
          ) : (
            <Eye className={styles.icon} aria-hidden="true" />
          )}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
