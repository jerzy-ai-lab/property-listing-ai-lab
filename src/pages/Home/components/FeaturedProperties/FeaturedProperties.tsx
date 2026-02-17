import { useFeaturedProperties } from "../../hooks/useFeaturedProperties";
import { PropertyCard } from "@/components/PropertyCard/PropertyCard";
import { SectionHeader } from "../SectionHeader/SectionHeader";
import { SECTION_HEADER_CONFIG } from "./featuredPropertiesConfig";
import styles from "./FeaturedProperties.module.css";
import type { Property } from "@/types/property";

interface FeaturedPropertiesProps {
  properties: Property[];
}

/* FeaturedProperties component */
export function FeaturedProperties({ properties }: FeaturedPropertiesProps) {
  const { featuredProperties } = useFeaturedProperties(properties);

  if (featuredProperties.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <SectionHeader
          title={SECTION_HEADER_CONFIG.title}
          subtitle={SECTION_HEADER_CONFIG.subtitle}
        />

        <ul className={styles.propertyList}>
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </ul>
      </div>
    </section>
  );
}
