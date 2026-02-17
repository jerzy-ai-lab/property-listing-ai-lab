import type { Property } from "@/types/property";
import { Star, ShieldCheck, Home, Users, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { truncateText } from "@/utils/helpers";
import { capitalizeFirst } from "@/utils/helpers";
import fallbackImage from "@/assets/images/fallback.webp";
import styles from "./PropertyCard.module.css";

type PropertyCardProperty = Pick<
  Property,
  | "id"
  | "title"
  | "description"
  | "price"
  | "rating"
  | "superhost"
  | "image"
  | "capacity"
> & {
  address?: Property["address"];
};

interface PropertyCardProps {
  property: PropertyCardProperty;
}

/* PropertyCard component */
const PropertyCard = ({ property }: PropertyCardProps) => {
  const id = property.id;
  const image = property.image || fallbackImage;
  const title = property.title ?? "Untitled Property";
  const description = property.description ?? "No description available.";
  const price = property.price ?? 0;
  const rating = property.rating ?? 0;
  const isSuperhost = property.superhost ?? false;
  const bedrooms = property.capacity?.bedroom ?? 0;
  const guests = property.capacity?.guest ?? 0;
  const location = property.address?.city ?? "Unknown location";

  return (
    <li className={styles.card}>
      <Link to={`/property/${id}`} className={styles.link}>
        {/* === Image section === */}
        <div className={styles.imageWrapper}>
          <img src={image} alt={title} className={styles.image} loading="lazy" />

          {isSuperhost && (
            <span className={clsx(styles.badge, styles.badgeLeft)}>
              Superhost <ShieldCheck className={styles.hostIcon} />
            </span>
          )}
          {rating > 0 && (
            <span className={clsx(styles.badge, styles.badgeRight)}>
              {rating} <Star className={styles.ratingIcon} />
            </span>
          )}
        </div>

        {/* === Content section === */}
        <div className={styles.content}>
          <h3 className={styles.title}>{truncateText(title, 80)}</h3>
          <p className={styles.description}>{truncateText(description, 90)}</p>

          {/* === Capacity section === */}
          <div className={styles.capacity}>
            <span className={styles.capacityItem}>
              <Home className={styles.capacityIcon} />
              {bedrooms} {bedrooms === 1 ? "bedroom" : "bedrooms"}
            </span>
            <span className={styles.capacityItem}>
              <Users className={styles.capacityIcon} />
              {guests} {guests === 1 ? "guest" : "guests"}
            </span>
          </div>

          {/* === Footer section === */}
          <div className={styles.footer}>
            <span className={styles.price}>
              ${price}
              <span className={styles.priceUnit}>/night</span>
            </span>

            <div className={styles.location}>
              <MapPin className={styles.locationIcon} />
              <span className={styles.locationText}>
                {capitalizeFirst(location)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
};

export default PropertyCard;
