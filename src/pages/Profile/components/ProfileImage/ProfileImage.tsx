import { Pencil } from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useProfileImageChange } from "../../hooks/useProfileImageChange";
import type { UseProfileImageUploadReturn } from "../../hooks/useProfileImageUpload";
import fallbackImage from "@/assets/images/fallback.webp";
import styles from "./ProfileImage.module.css";

interface ProfileImageProps {
  profileImageUpload: UseProfileImageUploadReturn;
}

/* ProfileImage component */
export function ProfileImage({ profileImageUpload }: ProfileImageProps) {
  const { isUploading, uploadImage: onImageUpload } = profileImageUpload;
  const { userProfile } = useUserProfile();
  const { fileInputRef, handleImageChange, handleImageButtonClick } =
    useProfileImageChange(onImageUpload);

  const imageUrl = userProfile?.profileImage || fallbackImage;

  return (
    <div className={styles.profileImage}>
      <img alt="Profile picture" src={imageUrl} className={styles.image} />

      {isUploading && (
        <div className={styles.uploading} aria-live="polite">
          Uploading...
        </div>
      )}

      <button
        type="button"
        className={styles.editImageButton}
        onClick={handleImageButtonClick}
        disabled={isUploading}
        aria-label="Edit profile image"
      >
        <Pencil className={styles.editImageIcon} />
        <input
          ref={fileInputRef}
          type="file"
          name="profileImage"
          accept=".jpg, .jpeg, .png, .webp"
          className={styles.inputFile}
          onChange={handleImageChange}
        />
      </button>
    </div>
  );
}
