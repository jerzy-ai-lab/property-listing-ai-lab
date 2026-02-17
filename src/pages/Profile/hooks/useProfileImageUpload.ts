import { useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { uploadUserImage } from "@/api/images";
import { updateUserProfileImage } from "@/api/users";

export interface UseProfileImageUploadReturn {
  isUploading: boolean;
  error: string | null;
  uploadImage: (file: File) => Promise<void>;
  setError: (error: string | null) => void;
}

// Hook for uploading user profile image
export const useProfileImageUpload = (): UseProfileImageUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthContext();

  const uploadImage = async (file: File): Promise<void> => {
    if (!user) {
      setError("User not authenticated");
      return;
    }

    const MAX_FILE_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      setError("Image size must be less than 2 MB");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Image must be in JPG, PNG, or WebP format");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const result = await uploadUserImage(file);
      await updateUserProfileImage(user.uid, result.url);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to upload profile image. Please try again."
      );
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
