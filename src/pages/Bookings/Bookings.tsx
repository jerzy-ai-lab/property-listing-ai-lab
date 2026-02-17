import { useBookings } from "./hooks/useBookings";
import { BookingCard } from "./components/BookingCard/BookingCard";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { Spinner } from "@/components/Spinner/Spinner";
import { Toast } from "@/components/Toast/Toast";
import { PAGE_HEADER_CONFIG } from "./bookingsConfig";
import styles from "./Bookings.module.css";

/* Bookings page component */
export function Bookings() {
  const {
    bookings,
    isLoading,
    error,
    setError,
    cancelBooking,
    cancellingBookingId,
  } = useBookings();

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className={styles.bookings}>
      {/* === Error Toast === */}
      {error && (
        <Toast message={error} variant="error" onClose={() => setError(null)} />
      )}

      {/* === Page Header === */}
      <PageHeader title={PAGE_HEADER_CONFIG.title} />

      {/* === Bookings List === */}
      {bookings.length === 0 ? (
        <EmptyState message="No bookings found" />
      ) : (
        <ul className={styles.bookingsList}>
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={cancelBooking}
              isCancelling={cancellingBookingId === booking.id}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
