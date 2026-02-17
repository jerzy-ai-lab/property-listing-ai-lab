import { forwardRef } from "react";
import clsx from "clsx";
import styles from "./Textarea.module.css";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

/* Textarea component */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={clsx(styles.textarea, className)}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";
