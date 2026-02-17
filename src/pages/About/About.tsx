import { Seo } from "@/components/Seo/Seo";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import {
  PAGE_HEADER_CONFIG,
  DESCRIPTION_CONFIG,
  FEATURES_CONFIG,
} from "./aboutConfig";
import { IconCard } from "@/components/IconCard/IconCard";
import styles from "./About.module.css";

/* About page */
export function About() {
  return (
    <div className={styles.about}>
      <Seo
        title="About"
        description={DESCRIPTION_CONFIG}
        canonicalPath="/about"
      />
      <PageHeader
        title={PAGE_HEADER_CONFIG.title}
        subtitle={PAGE_HEADER_CONFIG.subtitle}
      />

      <section className={styles.intro}>
        <p className={styles.description}>{DESCRIPTION_CONFIG}</p>
      </section>

      <section className={styles.features}>
        {/* Map FEATURES_CONFIG (AI Powered Search, Verified Properties, Interactive Maps) */}
        {FEATURES_CONFIG.map((feature, index) => {
          return <IconCard key={index} item={feature} />;
        })}
      </section>
    </div>
  );
}
