import { useLoaderData } from "react-router-dom";
import { Seo } from "@/components/Seo/Seo";
import { usePropertyFilters } from "./hooks/usePropertyFilters";
import { PropertyListFilterPanel } from "./components/PropertyListFilterPanel/PropertyListFilterPanel";
import { PropertyCard } from "@/components/PropertyCard/PropertyCard";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import styles from "./PropertyList.module.css";
import type { Property } from "@/types/property";

type PropertiesLoaderData = { properties: Property[] };

/* PropertyList page */
export function PropertyList() {
  const { properties } = useLoaderData() as PropertiesLoaderData;
  const {
    isSuperhost,
    setIsSuperhost,
    guestCount,
    setGuestCount,
    filteredByGuests,
  } = usePropertyFilters(properties);

  return (
    <div className={styles.propertyListPage}>
      <Seo
        title="Browse Properties"
        description="Browse all vacation rentals. Filter by superhost and guest capacity to find your perfect stay."
        canonicalPath="/properties"
      />
      {properties.length === 0 ? (
        <EmptyState message="No properties found." />
      ) : (
        <>
          <PropertyListFilterPanel
            isSuperhost={isSuperhost}
            onSuperhostChange={setIsSuperhost}
            guestCount={guestCount}
            onGuestCountChange={setGuestCount}
          />
          {filteredByGuests.length === 0 ? (
            <EmptyState message="No properties found matching your filters." />
          ) : (
            <ul className={styles.propertyList}>
              {filteredByGuests.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
