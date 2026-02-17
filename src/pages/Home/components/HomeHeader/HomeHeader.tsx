import heroImage from "@/assets/images/hero.webp";
import styles from "./HomeHeader.module.css";

/* HomeHeader component */
export function HomeHeader() {
  return (
    <section className={styles.header}>
      <img
        src={heroImage}
        alt="Mountain cabin landscape"
        className={styles.image}
      />

      <div className={styles.content}>
        <h1 className={styles.title}>
          Peace, nature,
          <br />
          dream
        </h1>
        <p className={styles.subtitle}>Find and book a great experience.</p>
      </div>
    </section>
  );
}
