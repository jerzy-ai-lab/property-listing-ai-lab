import type { Firestore } from "firebase-admin/firestore";
import type { RawMatch } from "./types.js";

type RetrieveCandidatesParams = {
  db: Firestore;
  queryVector: number[];
  limit: number;
};

type RetrieveCandidatesResult = {
  rawMatches: RawMatch[];
  fetchedCount: number;
};

/**
 * Service function for retrieving nearest vector candidates from Firestore.
 */
export async function retrieveCandidates({
  db,
  queryVector,
  limit,
}: RetrieveCandidatesParams): Promise<RetrieveCandidatesResult> {
  const vectorQuery = db.collection("properties").findNearest({
    vectorField: "embedding",
    queryVector,
    limit: limit * 2, // Fetch double to improve post-filtering quality
    distanceMeasure: "COSINE",
    distanceResultField: "vectorDistance",
  });

  const snapshot = await vectorQuery.get();
  const rawMatches = snapshot.docs
    .map(
      (doc): RawMatch => ({
        id: doc.id,
        data: doc.data(),
        distance: Number(doc.get("vectorDistance")),
        price: Number(doc.get("price")),
        guest: Number(doc.get("capacity.guest")),
        bedroom: Number(doc.get("capacity.bedroom")),
        city: String(doc.get("address.city") ?? "")
          .trim()
          .toLowerCase(),
      }),
    )
    .filter((item) => Number.isFinite(item.distance))
    .sort((a, b) => a.distance - b.distance);

  return {
    rawMatches,
    fetchedCount: snapshot.size,
  };
}
