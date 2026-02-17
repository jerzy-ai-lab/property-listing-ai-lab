import type { UserProfile } from "@/types/user";
import { PROFILE_FIELDS } from "../../profileConfig";
import { formatDate } from "@/utils/helpers";
import { Button } from "@/components/Button/Button";
import styles from "./ProfileInfo.module.css";

interface ProfileInfoProps {
  userProfile: UserProfile;
  isIncomplete: boolean;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

/* ProfileInfo component */
export function ProfileInfo({
  userProfile,
  isIncomplete,
  onEditClick,
  onDeleteClick,
}: ProfileInfoProps) {
  return (
    <>
      <ul className={styles.profileInfo}>
        {PROFILE_FIELDS.map((field) => (
          <li key={field.key} className={styles.infoRow}>
            <span className={styles.infoLabel}>{field.label}</span>
            <span className={styles.infoValue}>
              {userProfile[field.key] || "N/A"}
            </span>
          </li>
        ))}
        <li className={styles.infoRow}>
          <span className={styles.infoLabel}>Account Created:</span>
          <span className={styles.infoValue}>
            {formatDate(userProfile.accountCreatedAt) || "N/A"}
          </span>
        </li>
        <li className={styles.infoRow}>
          <span className={styles.infoLabel}>Profile Updated:</span>
          <span className={styles.infoValue}>
            {formatDate(userProfile.updatedAt) || "N/A"}
          </span>
        </li>
      </ul>
      <div className={styles.buttons}>
        <Button variant="primary" onClick={onEditClick}>
          {isIncomplete ? "Complete Profile" : "Edit Profile"}
        </Button>
        <Button variant="danger" onClick={onDeleteClick}>
          Delete Account
        </Button>
      </div>
    </>
  );
}
