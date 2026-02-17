import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/Navbar/Navbar";
import { Footer } from "@/components/Footer/Footer";
import styles from "./App.module.css";

export function App() {
  return (
    <div className={styles.appWrapper}>
      <header>
        <Navbar />
      </header>
      <main className={styles.app}>
        <Outlet />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
