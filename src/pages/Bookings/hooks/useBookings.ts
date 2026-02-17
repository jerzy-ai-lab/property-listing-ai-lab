import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchUserBookings,
  cancelBooking as cancelBookingService,
} from "@/api/bookings";
import { useAuthContext } from "@/contexts/AuthContext";
import type { Booking } from "@/types/booking";

export interface UseBookingsReturn {
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  cancelBooking: (bookingId: string) => Promise<void>;
  cancellingBookingId: string | null;
}

const BOOKINGS_QUERY_KEY = ["bookings"] as const;

export const useBookings = (): UseBookingsReturn => {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();
  const [mutationError, setMutationError] = useState<string | null>(null);

  const {
    data: bookings = [],
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: [...BOOKINGS_QUERY_KEY, user?.uid ?? ""],
    queryFn: () => fetchUserBookings(user!.uid),
    enabled: !!user,
  });

  const cancelMutation = useMutation({
    mutationFn: cancelBookingService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKINGS_QUERY_KEY });
      setMutationError(null);
    },
    onError: (err) => {
      setMutationError(err instanceof Error ? err.message : "Failed to cancel booking");
    },
  });

  const cancelBooking = async (bookingId: string): Promise<void> => {
    setMutationError(null);
    await cancelMutation.mutateAsync(bookingId);
  };

  const queryErrorMessage =
    queryError instanceof Error ? queryError.message : "Failed to load bookings";
  const error = mutationError ?? (queryError ? queryErrorMessage : null);

  return {
    bookings,
    isLoading,
    error,
    setError: setMutationError,
    cancelBooking,
    cancellingBookingId: cancelMutation.isPending
      ? (cancelMutation.variables as string) ?? null
      : null,
  };
};
