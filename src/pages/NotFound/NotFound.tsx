import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo/Seo";
import notFoundImage from "@/assets/images/not-found.webp";
import styles from "./NotFound.module.css";

/* Not found page */
export function NotFound() {
  return (
    <div className={styles.notFound}>
      <Seo title="Page Not Found" description="The page you're looking for doesn't exist." />
      <div className={styles.wrapper}>
        <img src={notFoundImage} alt="Not Found" className={styles.image} />
        <Link to="/" className={styles.link}>
          Go to Home
        </Link>
      </div>
    </div>
  );
}
