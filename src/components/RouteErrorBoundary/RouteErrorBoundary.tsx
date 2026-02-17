import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import styles from "../ErrorBoundary/ErrorBoundary.module.css";

/**
 * Route-level error boundary for React Router loaders and actions.
 * Renders when a loader throws or an action fails.
 */
export const RouteErrorBoundary = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            {error.status} {error.statusText}
          </h1>
          <p className={styles.message}>
            {typeof error.data === "string" ? error.data : "Something went wrong"}
          </p>
          <Link to="/" className={styles.link}>
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  if (error instanceof Error) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Something went wrong</h1>
          <p className={styles.message}>{error.message}</p>
          <Link to="/" className={styles.link}>
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Unknown error</h1>
        <Link to="/" className={styles.link}>
          Back to home
        </Link>
      </div>
    </div>
  );
};
