import { Search, Sparkles } from "lucide-react";
import Button from "@/components/Button/Button";
import styles from "./SearchInput.module.css";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

/* SearchInput component - Enhanced with AI visual cues */
const SearchInput = ({
  value,
  onChange,
  onSearch,
  isLoading,
}: SearchInputProps) => {
  return (
    <div className={styles.searchBox}>
      {/* Visual cue: AI Icon instead of generic Search if valid query exists */}
      <Search className={styles.icon} aria-hidden="true" />
      
      <input
        type="text"
        id="search-input"
        className={styles.input} // Direct styling for better control than generic Input
        placeholder="Describe your dream stay (e.g., 'Cozy cabin near Odda with sauna')"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
        aria-label="AI Property Search"
      />
      
      <Button
        variant="secondary"
        onClick={onSearch}
        type="button"
        disabled={isLoading}
        className={styles.searchButton}
        aria-busy={isLoading}
      >
        {isLoading ? (
          "Thinking..."
        ) : (
          <>
            <Sparkles size={16} style={{ marginRight: 8 }} />
            Ask AI
          </>
        )}
      </Button>
    </div>
  );
};

export default SearchInput;
