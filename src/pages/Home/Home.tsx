import { useLoaderData } from "react-router-dom";
import { Seo } from "@/components/Seo/Seo";
import { HomeHeader } from "./components/HomeHeader/HomeHeader";
import { AISearchBar } from "./components/AISearchBar/AISearchBar";
import { HowItWorks } from "./components/HowItWorks/HowItWorks";
import { FeaturedProperties } from "./components/FeaturedProperties/FeaturedProperties";
import styles from "./Home.module.css";
import type { Property } from "@/types/property";

type HomeLoaderData = { properties: Property[] };

/* Home page */
export function Home() {
  const { properties } = useLoaderData() as HomeLoaderData;

  return (
    <div className={styles.home}>
      <Seo
        title="Find Your Perfect Vacation Rental"
        description="Discover exceptional vacation rentals with AI-powered search. Browse verified properties and book your ideal stay."
        canonicalPath="/"
      />
      <HomeHeader />
      <AISearchBar />
      <HowItWorks />
      <FeaturedProperties properties={properties} />
    </div>
  );
}
