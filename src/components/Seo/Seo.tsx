import { Helmet } from "@dr.pogodin/react-helmet";
import { SEO_DEFAULTS } from "@/constants/seo";

export interface SeoProps {
  title?: string;
  description?: string;
  /** Full URL for canonical link and og:url */
  canonicalPath?: string;
  /** Full URL for og:image (e.g. property image) */
  image?: string;
  /** og:type – default "website" */
  type?: "website" | "article";
}

/**
 * SEO component – sets document title, meta description, Open Graph and Twitter Card tags.
 */
export function Seo({
  title,
  description,
  canonicalPath,
  image,
  type = "website",
}: SeoProps) {
  const fullTitle = title
    ? `${title} | ${SEO_DEFAULTS.siteName}`
    : SEO_DEFAULTS.title;
  const fullDescription = description ?? SEO_DEFAULTS.description;
  const base = SEO_DEFAULTS.baseUrl.replace(/\/$/, "");
  const canonicalUrl =
    base && canonicalPath
      ? `${base}${canonicalPath.startsWith("/") ? "" : "/"}${canonicalPath}`
      : base || undefined;
  const imageUrl = image?.startsWith("http")
    ? image
    : image && base
      ? `${base}${image.startsWith("/") ? "" : "/"}${image}`
      : undefined;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:site_name" content={SEO_DEFAULTS.siteName} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      {imageUrl && <meta property="og:image" content={imageUrl} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}

      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
    </Helmet>
  );
}
