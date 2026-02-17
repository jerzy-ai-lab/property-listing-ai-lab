import { SECTION_HEADER_CONFIG, STEPS_CONFIG } from "./howItWorksConfig";
import { SectionHeader } from "../SectionHeader/SectionHeader";
import { IconCard } from "@/components/IconCard/IconCard";
import styles from "./HowItWorks.module.css";

/* HowItWorks component */
export function HowItWorks() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <SectionHeader
          title={SECTION_HEADER_CONFIG.title}
          subtitle={SECTION_HEADER_CONFIG.subtitle}
        />

        <div className={styles.steps}>
          {/* Map STEPS_CONFIG (AI Search Engine, Filter & Browse, Explore Details) */}
          {STEPS_CONFIG.map((step, index) => (
            <IconCard key={index} item={step} />
          ))}
        </div>
      </div>
    </section>
  );
}
