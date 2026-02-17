import { collection, addDoc } from "firebase/firestore";
import { database } from "@/config/firebaseConfig";
import { Button } from "@/components/Button/Button";
import type { Property } from "@/types/property";

const DATA_URL =
  "https://raw.githubusercontent.com/devchallenges-io/curriculum/refs/heads/main/4-frontend-libaries/challenges/group_1/data/property-listing-data.json";

export function PropertyImporter() {
  // Import products from external API to Firestore
  const handleImport = async () => {
    try {
      // Fetch products from external API
      const response = await fetch(DATA_URL);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const properties: Property[] = await response.json();
      // Add each product to Firestore database
      for (const property of properties) {
        await addDoc(collection(database, "properties"), property);

        console.info(`✅ Added: ${property.title}`);
      }

      console.info("🎉 Bingo!");
    } catch (error) {
      console.error("❌ Error import", error);
    }
  };

  return (
    <Button onClick={handleImport} type="button">
      Import properties to Firestore
    </Button>
  );
}

// Add this component to your main app or a specific page where you want to trigger the import. Use only once to avoid duplicate imports!
