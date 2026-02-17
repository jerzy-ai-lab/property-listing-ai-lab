import type { Booking } from "@/types/booking";
import { formatDate, formatPrice } from "@/utils/helpers";
import { Divider } from "@/components/Divider/Divider";
import styles from "./PropertyBookingSummary.module.css";

interface PropertyBookingSummaryProps {
  booking: Booking;
}

/* PropertyBookingSummary component */
export function PropertyBookingSummary({ booking }: PropertyBookingSummaryProps) {
  const checkInDate = formatDate(booking.checkIn);
  const checkOutDate = formatDate(booking.checkOut);

  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>Your booking</h3>

      <div className={styles.summary}>
        <div className={styles.row}>
          <span className={styles.label}>Check-in</span>
          <span className={styles.value}>{checkInDate ?? "—"}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Check-out</span>
          <span className={styles.value}>{checkOutDate ?? "—"}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Guests</span>
          <span className={styles.value}>
            {booking.guests} {booking.guests === 1 ? "guest" : "guests"}
          </span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Nights</span>
          <span className={styles.value}>
            {booking.nights} {booking.nights === 1 ? "night" : "nights"}
          </span>
        </div>
      </div>

      <Divider />

      <div className={styles.total}>
        <span className={styles.totalLabel}>Total</span>
        <span className={styles.totalValue}>
          ${formatPrice(booking.totalPrice)}
        </span>
      </div>
    </div>
  );
}
