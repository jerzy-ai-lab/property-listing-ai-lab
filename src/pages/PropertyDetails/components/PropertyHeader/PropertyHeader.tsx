import type { Property } from "@/types/property";
import { Star, ShieldCheck, MapPin } from "lucide-react";
import fallbackImage from "@/assets/images/fallback.webp";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import { capitalizeFirst } from "@/utils/helpers";
import styles from "./PropertyHeader.module.css";

interface PropertyHeaderProps {
  property: Property;
}

export function PropertyHeader({ property }: PropertyHeaderProps) {
  const title = property.title ?? "";
  const rating = property.rating ?? 0;
  const isSuperhost = property.superhost ?? false;
  const location = property.address.city ?? "";
  const image = property.image ?? fallbackImage;

  return (
    <section className={styles.header}>
      {/* === Title === */}
      <PageHeader title={title} variant="left" />

      {/* === Meta Info === */}
      <div className={styles.meta}>
        <div className={styles.rating}>
          <span className={styles.ratingText}>{rating}</span>
          <Star className={styles.ratingIcon} />
        </div>

        {isSuperhost && (
          <div className={styles.host}>
            <ShieldCheck className={styles.hostIcon} />
            <span className={styles.hostText}>Superhost</span>
          </div>
        )}

        <div className={styles.location}>
          <MapPin className={styles.locationIcon} />
          <span className={styles.locationText}>
            {capitalizeFirst(location)}
          </span>
        </div>
      </div>

      {/* === Property Image  === */}
      <div className={styles.imageWrapper}>
        <img src={image} alt={title} className={styles.image} />
      </div>
    </section>
  );
}
