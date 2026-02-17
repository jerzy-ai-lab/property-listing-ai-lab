import { useState, type MouseEvent } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { Input } from "@/components/Input/Input";
import { FormError } from "@/components/FormError/FormError";
import type { Matcher } from "react-day-picker";
import styles from "./DatePickerInput.module.css";

interface DatePickerInputProps {
  id?: string;
  label?: string;
  selected?: Date | null;
  onSelect?: (date: Date | undefined) => void;
  disabled?: Matcher | Matcher[];
  placeholder?: string;
  error?: string;
}

/* DatePickerInput component */
export function DatePickerInput({
  id,
  label,
  selected,
  onSelect,
  disabled,
  placeholder = "Select date",
  error,
}: DatePickerInputProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEscapeKey(isOpen, () => setIsOpen(false));

  const handleInputClick = () => {
    setIsOpen(!isOpen);
  };

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      setIsOpen(false);
    }
  };

  const handleDaySelect = (date: Date | undefined) => {
    if (date) {
      onSelect?.(date);
      setIsOpen(false);
    }
  };

  const displayValue = selected ? format(selected, "dd/MM/yyyy") : "";

  return (
    <>
      <div className={styles.wrapper}>
        <Input
          id={id}
          readOnly
          value={displayValue}
          placeholder={placeholder}
          onClick={handleInputClick}
          aria-label={label}
        />

        {isOpen && (
          <div className={styles.calendar}>
            <DayPicker
              mode="single"
              selected={selected || undefined}
              onSelect={handleDaySelect}
              disabled={disabled}
              defaultMonth={selected || new Date()}
            />
          </div>
        )}

        <FormError error={error} />
      </div>

      {isOpen && (
        <div className={styles.backdrop} onClick={handleBackdropClick} />
      )}
    </>
  );
}
