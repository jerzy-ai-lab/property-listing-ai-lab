import clsx from "clsx";
import styles from "./ToggleSwitch.module.css";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  disabled?: boolean;
  id?: string;
}

/* ToggleSwitch component */
export function ToggleSwitch({
  checked,
  onChange,
  ariaLabel = "Toggle switch",
  ariaLabelledBy,
  disabled = false,
  id,
}: ToggleSwitchProps) {
  return (
    <label
      htmlFor={id}
      className={clsx(styles.switch, disabled && styles.disabled)}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className={styles.input}
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabelledBy ? undefined : ariaLabel}
        aria-labelledby={ariaLabelledBy}
      />
      <span className={clsx(styles.track, checked && styles.checked)}>
        <span className={styles.thumb} />
      </span>
    </label>
  );
}
