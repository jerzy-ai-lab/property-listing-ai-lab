import { useQuery } from "@tanstack/react-query";
import { fetchPropertyBookedDates } from "@/api/bookings";

export interface UsePropertyBookedDatesReturn {
  bookedRanges: { from: Date; to: Date }[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

const PROPERTY_BOOKED_DATES_QUERY_KEY = ["propertyBookedDates"] as const;

/** Hook for fetching booked dates for a property */
export const usePropertyBookedDates = (
  propertyId: string | undefined,
): UsePropertyBookedDatesReturn => {
  const {
    data: bookedRanges = [],
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: [...PROPERTY_BOOKED_DATES_QUERY_KEY, propertyId ?? ""],
    queryFn: () => fetchPropertyBookedDates(propertyId!),
    enabled: !!propertyId,
  });

  const errorMessage = queryError
    ? (queryError as Error).message.toLowerCase().includes("permission")
      ? "You must be logged in to make a booking"
      : "Failed to load booked dates. Please try again."
    : null;

  return {
    bookedRanges,
    isLoading,
    error: queryError ? errorMessage : null,
    refetch,
  };
};
