import { useState, useDeferredValue } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/config/firebaseConfig";
import type { SearchPropertyResult } from "@/types/searchPropertyResult";

type SearchPropertiesRequest = {
  query: string;
};

type SearchPropertiesResponse = {
  results: SearchPropertyResult[];
};

export interface UseAISearchReturn {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  deferredQuery: string;
  results: SearchPropertyResult[];
  suggestions: string[];
  isLoading: boolean;
  error: string | null;
  handleSearch: () => Promise<void>;
  showEmptyState: boolean;
}

/* Hook for searching properties with AI */
export const useAISearch = (): UseAISearchReturn => {
  const [searchQuery, setSearchQuery] = useState("");
  const deferredQuery = useDeferredValue(searchQuery);
  const [results, setResults] = useState<SearchPropertyResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery) {
      setError("Please enter a valid search query.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const searchProperties = httpsCallable<
        SearchPropertiesRequest,
        SearchPropertiesResponse
      >(functions, "searchProperties");
      const { data } = await searchProperties({ query: trimmedQuery });
      if (!Array.isArray(data.results)) {
        throw new Error(
          "Search API response is outdated. Deploy latest Firebase Functions with { results } contract.",
        );
      }
      const responseResults = data.results;

      setSuggestions([]);
      setResults(responseResults);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to search properties. Please try again.",
      );
      setResults([]);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const showEmptyState =
    hasSearched &&
    results.length === 0 &&
    !isLoading &&
    !!searchQuery &&
    !error &&
    suggestions.length === 0;

  return {
    searchQuery,
    setSearchQuery,
    deferredQuery,
    results,
    suggestions,
    isLoading,
    error,
    handleSearch,
    showEmptyState,
  };
};
