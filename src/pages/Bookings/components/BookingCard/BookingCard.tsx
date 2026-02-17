import { Link } from "react-router-dom";
import type { Booking } from "@/types/booking";
import { CalendarDays, Users } from "lucide-react";
import { formatDate, formatPrice } from "@/utils/helpers";
import { truncateText } from "@/utils/helpers";
import { Button } from "@/components/Button/Button";
import { Divider } from "@/components/Divider/Divider";
import styles from "./BookingCard.module.css";

interface BookingCardProps {
  booking: Booking;
  onCancel: (bookingId: string) => void;
  isCancelling?: boolean;
}

/* BookingCard component */
export function BookingCard({
  booking,
  onCancel,
  isCancelling = false,
}: BookingCardProps) {
  const {
    id,
    propertyId,
    propertyTitle,
    propertyImage,
    checkIn,
    checkOut,
    guests,
    nights,
    totalPrice,
  } = booking;

  const checkInDate = formatDate(checkIn);
  const checkOutDate = formatDate(checkOut);

  const handleCancelClick = () => {
    onCancel(id);
  };

  return (
    <li className={styles.card}>
      <Link
        to={`/property/${propertyId}`}
        state={{ booking }}
        className={styles.link}
      >
        {/* === Image section === */}
        <div className={styles.imageWrapper}>
          <img
            src={propertyImage}
            alt={propertyTitle}
            className={styles.image}
          />
        </div>

        {/* === Content section === */}
        <div className={styles.content}>
          <h3 className={styles.title}>{truncateText(propertyTitle, 80)}</h3>

          {/* === Dates section === */}
          <div className={styles.dates}>
            <span className={styles.dateItem}>
              <CalendarDays className={styles.dateIcon} />
              <span className={styles.dateLabel}>Check-in:</span>
              <span className={styles.dateValue}>{checkInDate || "N/A"}</span>
            </span>
            <span className={styles.dateItem}>
              <CalendarDays className={styles.dateIcon} />
              <span className={styles.dateLabel}>Check-out:</span>
              <span className={styles.dateValue}>{checkOutDate || "N/A"}</span>
            </span>
          </div>

          {/* === Details section === */}
          <div className={styles.details}>
            <span className={styles.detailItem}>
              <Users className={styles.detailIcon} />
              {guests} {guests === 1 ? "guest" : "guests"}
            </span>
            <span className={styles.detailItem}>
              {nights} {nights === 1 ? "night" : "nights"}
            </span>
          </div>
        </div>
      </Link>

      <Divider variant="muted" />

      {/* === Footer section === */}
      <div className={styles.footer}>
        <span className={styles.price}>Total: ${formatPrice(totalPrice)}</span>
        <Button
          variant="danger"
          onClick={handleCancelClick}
          disabled={isCancelling}
        >
          {isCancelling ? "Cancelling..." : "Cancel"}
        </Button>
      </div>
    </li>
  );
}
