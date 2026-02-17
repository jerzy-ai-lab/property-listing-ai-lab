import { onCall, HttpsError } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions/v2";
import { defineSecret } from "firebase-functions/params";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { generateEmbedding } from "./embeddings.js";
import { parseSearchIntent } from "./search/parseSearchIntent.js";
import { retrieveCandidates } from "./search/retrieveCandidates.js";
import { applyBusinessFilters } from "./search/applyBusinessFilters.js";
import { mapToResponse } from "./search/mapToResponse.js";
import { createOnPropertyWrite } from "./indexing/onPropertyWrite.js";
import { createGenerateDescription } from "./content/generateDescription.js";
import type { SearchPropertyResult } from "./search/types.js";

setGlobalOptions({ maxInstances: 10, region: "europe-north1" });

initializeApp();

const db = getFirestore();

const VECTOR_SEARCH_LIMIT = 50;
const VECTOR_MAX_RESULTS = 5;
const VECTOR_ABSOLUTE_DISTANCE_THRESHOLD = 0.35;
const VECTOR_RELATIVE_DISTANCE_MARGIN = 0.08;
const GEMINI_API_KEY = defineSecret("GEMINI_API_KEY");

/* Callable function for vector search over properties */
export const searchProperties = onCall<{ query: string }>(
  { cors: true, secrets: [GEMINI_API_KEY] },
  async (request): Promise<{ results: SearchPropertyResult[] }> => {
    const query = request.data?.query;

    if (typeof query !== "string" || !query.trim()) {
      throw new HttpsError(
        "invalid-argument",
        "query must be a non-empty string",
      );
    }

    const searchIntent = parseSearchIntent(query);
    const { trimmedQuery, maxPrice, capacityHint, priceConstraint } =
      searchIntent;
    const queryVector = await generateEmbedding(
      trimmedQuery,
      "RETRIEVAL_QUERY",
    );
    console.info("searchProperties: generated query embedding", {
      queryLength: trimmedQuery.length,
      embeddingLength: queryVector.length,
    });

    if (queryVector.length === 0) {
      return { results: [] };
    }

    const { rawMatches, fetchedCount } = await retrieveCandidates({
      db,
      queryVector,
      limit: VECTOR_SEARCH_LIMIT,
    });
    const { filteredMatches, cityInQuery, bestDistance, distanceCutoff } =
      applyBusinessFilters({
        rawMatches,
        query: trimmedQuery,
        maxPrice,
        priceConstraint,
        capacityHint,
        absoluteDistanceThreshold: VECTOR_ABSOLUTE_DISTANCE_THRESHOLD,
        relativeDistanceMargin: VECTOR_RELATIVE_DISTANCE_MARGIN,
      });

    if (filteredMatches.length === 0) {
      return { results: [] };
    }

    const results = mapToResponse({
      matches: filteredMatches,
      maxResults: VECTOR_MAX_RESULTS,
    });
    console.info("searchProperties: vector search completed", {
      maxPrice,
      priceInclusive: priceConstraint?.inclusive ?? null,
      capacityHint,
      cityInQuery,
      bestDistance,
      distanceCutoff,
      fetchedCount,
      resultsCount: results.length,
    });

    return { results };
  },
);

/* Trigger: stores embedding after property create/update */
export const onPropertyWrite = createOnPropertyWrite(GEMINI_API_KEY);

/* NEW: AI Magic Description Generator */
export const generateDescription = createGenerateDescription(GEMINI_API_KEY);
