import styles from "./Footer.module.css";

/* Footer component */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.copyright}>
          © {currentYear} Property Listing. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
