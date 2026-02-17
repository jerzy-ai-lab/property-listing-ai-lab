import type { SearchPropertyResult } from "@/types/searchPropertyResult";
import { PropertyCard } from "@/components/PropertyCard/PropertyCard";
import styles from "./SearchResults.module.css";

interface SearchResultsProps {
  results: SearchPropertyResult[];
}

/* SearchResults component */
export function SearchResults({ results }: SearchResultsProps) {
  if (results.length === 0) return null;

  return (
    <div className={styles.results}>
      <h3 className={styles.title}>Found: {results.length}</h3>
      <ul className={styles.list}>
        {results.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </ul>
    </div>
  );
}
