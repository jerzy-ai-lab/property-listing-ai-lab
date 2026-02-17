import styles from "./SearchSuggestions.module.css";

interface SearchSuggestionsProps {
  suggestions: string[];
}

/* SearchSuggestions component */
export function SearchSuggestions({ suggestions }: SearchSuggestionsProps) {
  if (suggestions.length === 0) return null;

  return (
    <div className={styles.suggestions}>
      <h4 className={styles.title}>Did you mean:</h4>
      <ul className={styles.list}>
        {suggestions.map((suggestionText, index) => (
          <li key={index} className={styles.item}>
            {suggestionText}
          </li>
        ))}
      </ul>
    </div>
  );
}

