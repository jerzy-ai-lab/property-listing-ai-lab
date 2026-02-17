import { useState } from "react";
import { uploadPropertyImage } from "@/api/images";

export interface UsePropertyImageUploadReturn {
  isUploading: boolean;
  error: string | null;
  uploadImage: (file: File) => Promise<string | null>;
  setError: (error: string | null) => void;
}

// Hook for uploading property image
export const usePropertyImageUpload = (): UsePropertyImageUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<string | null> => {
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      setError("Image size must be less than 5 MB");
      return null;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Image must be in JPG, PNG, or WebP format");
      return null;
    }

    setIsUploading(true);
    setError(null);

    try {
      const result = await uploadPropertyImage(file);
      return result.url;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to upload property image. Please try again."
      );
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    error,
    uploadImage,
    setError,
  };
};
