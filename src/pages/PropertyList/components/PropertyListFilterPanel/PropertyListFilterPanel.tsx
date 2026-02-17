import type { ChangeEvent } from "react";
import { ToggleSwitch } from "@/components/ToggleSwitch/ToggleSwitch";
import { Select } from "@/components/Select/Select";
import { GUEST_OPTIONS } from "./propertyListFilterPanelConfig";
import styles from "./PropertyListFilterPanel.module.css";

interface PropertyListFilterPanelProps {
  isSuperhost: boolean;
  onSuperhostChange: (value: boolean) => void;
  guestCount: string;
  onGuestCountChange: (value: string) => void;
}

/* PropertyListFilterPanel component */
export function PropertyListFilterPanel({
  isSuperhost,
  onSuperhostChange,
  guestCount,
  onGuestCountChange,
}: PropertyListFilterPanelProps) {
  return (
    <div className={styles.filterPanel}>
      <div className={styles.rightFilters}>
        <div className={styles.superhostToggle}>
          <label htmlFor="superhost" className={styles.switchLabel}>
            Superhost
          </label>
          <ToggleSwitch
            checked={isSuperhost}
            onChange={onSuperhostChange}
            id="superhost"
          />
        </div>

        <div className={styles.guestsFilter}>
          <Select
            options={GUEST_OPTIONS}
            value={guestCount}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              onGuestCountChange(e.target.value)
            }
            ariaLabel="Select number of guests"
            id="guests"
          />
        </div>
      </div>
    </div>
  );
}
