import { useState, useMemo, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingFormSchema, type BookingFormData } from "../bookingFormSchema";
import {
  createBooking,
  checkPropertyAvailability,
} from "@/api/bookings";
import { useAuthContext } from "@/contexts/AuthContext";
import { calculateNights } from "@/utils/helpers";
import type { Property } from "@/types/property";

// Hook for booking form
export const useBookingForm = (property: Property | null) => {
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthContext();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      checkIn: undefined,
      checkOut: undefined,
      guests: "",
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

  const checkIn = watch("checkIn");
  const checkOut = watch("checkOut");
  const guests = watch("guests") ?? "";

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    return calculateNights(checkIn, checkOut);
  }, [checkIn, checkOut]);

  const pricePerNight = property?.price ?? 0;

  const totalPrice = useMemo(() => {
    return nights * pricePerNight;
  }, [nights, pricePerNight]);

  const onSubmit = (data: BookingFormData) => {
    if (!property) {
      setError("Property not found");
      return;
    }

    if (!user) {
      setError("You must be logged in to make a booking");
      return;
    }

    setError(null);

    return new Promise<void>((resolve) => {
      startTransition(async () => {
        try {
          const isAvailable = await checkPropertyAvailability(
            property.id,
            data.checkIn,
            data.checkOut,
          );

          if (!isAvailable) {
            setError("This property is not available for the selected dates");
            resolve();
            return;
          }

          await createBooking(
            user.uid,
            {
              propertyId: property.id,
              checkIn: data.checkIn,
              checkOut: data.checkOut,
              guests: Number(data.guests),
            },
            property,
          );

          reset();
          setIsSuccess(true);
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to create booking. Please try again.",
          );
        } finally {
          resolve();
        }
      });
    });
  };

  return {
    register,
    control,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    checkIn,
    checkOut,
    guests,
    nights,
    pricePerNight,
    totalPrice,
    isLoading: isSubmitting || isPending,
    error,
    setError,
    isSuccess,
  };
};
