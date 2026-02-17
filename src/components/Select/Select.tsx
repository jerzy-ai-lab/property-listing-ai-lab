import { forwardRef } from "react";
import clsx from "clsx";
import styles from "./Select.module.css";

type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

interface SelectProps extends Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "onChange"
> {
  options: SelectOption[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
}

/* Select component */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder,
      disabled = false,
      id,
      ariaLabel = "Select",
      className,
      ...rest
    },
    ref,
  ) => {
    const isControlled = value !== undefined;

    return (
      <div className={clsx(styles.selectWrapper, className)}>
        <select
          ref={ref}
          id={id}
          value={isControlled ? value : undefined}
          onChange={onChange}
          disabled={disabled}
          aria-label={ariaLabel}
          className={styles.select}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        <svg
          className={styles.arrow}
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M1 1L6 6L11 1"
            stroke="var(--color-text-light)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  },
);

Select.displayName = "Select";
