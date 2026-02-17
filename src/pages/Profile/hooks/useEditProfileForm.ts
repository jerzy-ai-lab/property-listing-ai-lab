import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  editProfileFormSchema,
  type EditProfileFormData,
} from "../editProfileFormSchema";
import { updateUserProfile } from "@/api/users";
import { useAuthContext } from "@/contexts/AuthContext";
import type { UserProfile } from "@/types/user";

// Hook for edit profile form
export const useEditProfileForm = (userProfile: UserProfile | null) => {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthContext();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileFormSchema),
    defaultValues: {
      firstName: userProfile?.firstName ?? "",
      lastName: userProfile?.lastName ?? "",
      phone: userProfile?.phone ?? "",
    },
    mode: "onBlur",
  });

  useEffect(() => {
    if (userProfile) {
      reset({
        firstName: userProfile.firstName ?? "",
        lastName: userProfile.lastName ?? "",
        phone: userProfile.phone ?? "",
      });
    }
  }, [userProfile, reset, user]);

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        setIsSuccess(false);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  const onSubmit = async (data: EditProfileFormData) => {
    if (!user) {
      setError("User not authenticated");
      return;
    }

    setError(null);

    try {
      await updateUserProfile(user.uid, {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      });
      setIsSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update profile. Please try again."
      );
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    isSuccess,
    errors,
    resetForm: reset,
    isLoading: isSubmitting,
    error,
    setError,
  };
};
