import { useRef } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/Button/Button";
import type { UsePropertyImageUploadReturn } from "../../hooks/usePropertyImageUpload";
import fallbackImage from "@/assets/images/fallback.webp";
import styles from "./PropertyImageUpload.module.css";

interface PropertyImageUploadProps {
  imageUpload: UsePropertyImageUploadReturn;
  imageUrl: string | null;
  onImageChange: (url: string) => void;
}

/* PropertyImageUpload component */
export function PropertyImageUpload({
  imageUpload,
  imageUrl,
  onImageChange,
}: PropertyImageUploadProps) {
  const { isUploading, uploadImage } = imageUpload;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const url = await uploadImage(file);
    if (url) {
      onImageChange(url);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const displayImage = imageUrl || fallbackImage;

  return (
    <div className={styles.propertyImageUpload}>
      <div className={styles.imageWrapper}>
        <img alt="Property" src={displayImage} className={styles.image} />
        {isUploading && (
          <div className={styles.uploading} aria-live="polite">
            Uploading...
          </div>
        )}
      </div>

      <Button
        variant="primary"
        onClick={handleImageButtonClick}
        disabled={isUploading}
        aria-label="Upload property image"
        className={styles.uploadButton}
      >
        <Upload className={styles.uploadIcon} />
        {imageUrl ? "Change Image" : "Upload Image"}
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        name="propertyImage"
        accept=".jpg, .jpeg, .png, .webp"
        className={styles.inputFile}
        onChange={handleImageChange}
      />
    </div>
  );
}
