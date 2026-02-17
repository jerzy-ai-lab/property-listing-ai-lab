/** Production URL – used when VITE_APP_URL is not set (e.g. Netlify deploy) */
const PRODUCTION_URL = "https://property-listing-react.netlify.app";

/**
 * Default SEO configuration for the application.
 * VITE_APP_URL should be set in .env (local) or Netlify env vars (production).
 */
export const SEO_DEFAULTS = {
  siteName: "Property Listing",
  title: "Property Listing – Find Your Perfect Vacation Rental",
  description:
    "Find exceptional vacation rentals with AI-powered search. Browse verified properties, explore interactive maps, and book your perfect stay.",
  /** Base URL for canonical links and Open Graph. Set VITE_APP_URL or falls back to production URL. */
  baseUrl:
    import.meta.env.VITE_APP_URL ??
    (import.meta.env.PROD ? PRODUCTION_URL : ""),
} as const;
