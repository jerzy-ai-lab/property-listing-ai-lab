import styles from "./EmptyState.module.css";

interface EmptyStateProps {
  message: string;
}

// EmptyState component for displaying a message when no properties are found
export function EmptyState({ message = "No items found." }: EmptyStateProps) {
  return (
    <div className={styles.emptyState}>
      <p className={styles.emptyMessage}>{message}</p>
    </div>
  );
}
