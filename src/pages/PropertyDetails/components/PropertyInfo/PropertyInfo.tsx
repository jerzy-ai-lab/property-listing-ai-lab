import type { Property } from "@/types/property";
import { Home, Users } from "lucide-react";
import { Divider } from "@/components/Divider/Divider";
import fallbackImage from "@/assets/images/fallback.webp";
import { capitalizeFirst } from "@/utils/helpers";
import { AMENITIES_CONFIG } from "./propertyInfoConfig";
import styles from "./PropertyInfo.module.css";

interface PropertyInfoProps {
  property: Property;
}

const SECTION_HEADINGS = [
  "Stemning og opplevelse",
  "Fasiliteter",
  "Beliggenhet og praktisk info",
] as const;

const parseDescriptionSections = (rawDescription: string): string[] => {
  const normalizedDescription = rawDescription
    .replace(/\r\n/g, "\n")
    .replace(/^##\s.*$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (!normalizedDescription) {
    return ["", "", ""];
  }

  const sections = normalizedDescription
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);

  return [sections[0] ?? "", sections[1] ?? "", sections[2] ?? ""];
};

/* PropertyInfo component */
export function PropertyInfo({ property }: PropertyInfoProps) {
  const hostName = capitalizeFirst(property.host?.name || "");
  const hostImage = property.host?.image || fallbackImage;
  const bedrooms = property.capacity?.bedroom;
  const guests = property.capacity?.guest;
  const amenities = property.amenities ?? [];
  const descriptionSections = parseDescriptionSections(
    property.description ?? "",
  );

  const amenitiesToShow = AMENITIES_CONFIG.filter(({ key }) =>
    amenities.includes(key),
  );

  return (
    <div className={styles.info}>
      {/* === Host Section === */}
      <div className={styles.hostSection}>
        <div className={styles.hostInfo}>
          <h2 className={styles.hostText}>Cabin hosted by {hostName}</h2>
          <img src={hostImage} alt={hostName} className={styles.hostImage} />
        </div>
      </div>

      {/* === Capacity section === */}
      <div className={styles.capacitySection}>
        <span className={styles.capacityItem}>
          <Home className={styles.capacityIcon} />
          {bedrooms} {bedrooms === 1 ? "bedroom" : "bedrooms"}
        </span>
        <span className={styles.capacityItem}>
          <Users className={styles.capacityIcon} />
          {guests} {guests === 1 ? "guest" : "guests"}
        </span>
      </div>

      <Divider variant="default" />

      {/* === Description === */}
      <div className={styles.description}>
        {SECTION_HEADINGS.map((heading, index) => (
          <div key={heading}>
            <h3 className={styles.descriptionHeading}>{heading}</h3>
            <p className={styles.descriptionParagraph}>
              {descriptionSections[index] || "Information will be available soon."}
            </p>
          </div>
        ))}
      </div>

      <Divider variant="default" />

      {/* === Amenities === */}
      <div className={styles.amenities}>
        <h3 className={styles.amenitiesTitle}>What this place offers</h3>
        <div className={styles.amenitiesGrid}>
          {amenitiesToShow.map(({ key, icon: Icon, label }) => (
            <div key={key} className={styles.amenityItem}>
              <Icon className={styles.amenityIcon} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
