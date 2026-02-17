import styles from "./Spinner.module.css";

export function Spinner() {
  return (
    <div className={styles.spinnerContainer}>
      {/* Loading spinner animation */}
      <div className={styles.spinnerCircle}></div>
    </div>
  );
}
