import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addListingFormSchema,
  type AddListingFormData,
  type AddListingFormInput,
} from "../addListingFormSchema";
import { useAuthContext } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { createProperty } from "@/api/properties";

const defaultAmenities: string[] = [];

// Hook for AddListing form
export const useAddListingForm = () => {
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthContext();
  const { userProfile } = useUserProfile();

  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
    getValues,
  } = useForm<AddListingFormInput, unknown, AddListingFormData>({
    resolver: zodResolver(addListingFormSchema),
    defaultValues: {
      title: "",
      street: "",
      zipCode: "",
      city: "",
      country: "",
      description: "",
      bedroom: "",
      guest: "",
      price: "",
      amenities: defaultAmenities,
      image: "",
    },
    mode: "onBlur",
  });

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        setIsSuccess(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  const onSubmit = (data: AddListingFormData) => {
    setError(null);

    if (!user) {
      setError("You must be logged in to add a listing.");
      return;
    }

    const hostName = userProfile?.firstName || "";
    const hostImage = userProfile?.profileImage || "";

    return new Promise<void>((resolve) => {
      startTransition(async () => {
        try {
          await createProperty(user.uid, {
            hostId: user.uid,
            title: data.title,
            description: data.description,
            price: data.price,
            rating: 0,
            superhost: false,
            image: data.image,
            address: {
              street: data.street.trim().toLowerCase(),
              zipCode: data.zipCode.trim(),
              city: data.city.trim().toLowerCase(),
              country: data.country.trim().toLowerCase(),
            },
            amenities: data.amenities,
            capacity: {
              guest: data.guest,
              bedroom: data.bedroom,
            },
            host: {
              name: hostName.trim().toLowerCase(),
              image: hostImage,
            },
          });
          reset();
          setIsSuccess(true);
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to add listing. Please try again.",
          );
        } finally {
          resolve();
        }
      });
    });
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    control,
    trigger,
    errors,
    watch,
    setValue,
    getValues,
    resetForm: reset,
    isSuccess,
    setIsSuccess,
    isLoading: isSubmitting || isPending,
    error,
    setError,
  };
};
