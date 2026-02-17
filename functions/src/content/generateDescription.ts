import { onCall, HttpsError } from "firebase-functions/v2/https";
import type { SecretParam } from "firebase-functions/params";
import { GoogleGenAI, Type } from "@google/genai";

type GenerateDescriptionData = {
  title: string;
  type?: string;
  city?: string;
  amenities?: string[];
  notes?: string;
  bedroom?: number;
  guest?: number;
};

type GenerateDescriptionResponse = {
  title: string;
  description: string;
};

const DESCRIPTION_MODEL = "gemini-1.5-flash";

type GeneratedSections = {
  atmosphere?: string;
  amenities?: string;
  location?: string;
};

const trimSections = (
  sections: GeneratedSections | undefined,
): { atmosphere: string; amenities: string; location: string } => ({
  atmosphere: sections?.atmosphere?.trim() ?? "",
  amenities: sections?.amenities?.trim() ?? "",
  location: sections?.location?.trim() ?? "",
});

const parseGeneratedListing = (
  rawText: string,
): { title?: string; sections?: GeneratedSections } => {
  try {
    return JSON.parse(rawText) as {
      title?: string;
      sections?: GeneratedSections;
    };
  } catch (err) {
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("AI Description Parse Error:", err);
      return {};
    }

    try {
      return JSON.parse(jsonMatch[0]) as {
        title?: string;
        sections?: GeneratedSections;
      };
    } catch (nestedErr) {
      console.error("AI Description Parse Error:", nestedErr);
      return {};
    }
  }
};

export const createGenerateDescription = (geminiApiKey: SecretParam) =>
  onCall<GenerateDescriptionData, Promise<GenerateDescriptionResponse>>(
    {
      cors: true,
      secrets: [geminiApiKey],
      region: "europe-north1",
      maxInstances: 10,
    },
    async (request) => {
      const title = request.data?.title?.trim();
      const listingType = request.data?.type?.trim() || "Ikke spesifisert";
      const city = request.data?.city?.trim() || "Ukjent sted";
      const notes = request.data?.notes?.trim() || "";
      const amenities = (request.data?.amenities ?? [])
        .map((amenity) => amenity.trim())
        .filter(Boolean);
      const bedroom =
        typeof request.data?.bedroom === "number" ? request.data.bedroom : null;
      const guest =
        typeof request.data?.guest === "number" ? request.data.guest : null;

      if (!title) {
        throw new HttpsError("invalid-argument", "Title is required");
      }

      const apiKey = geminiApiKey.value().trim();
      if (!apiKey) {
        throw new HttpsError(
          "failed-precondition",
          "GEMINI_API_KEY is not configured",
        );
      }

      const ai = new GoogleGenAI({ apiKey });

      const prompt = `
        Du er en erfaren tekstforfatter for ferieboliger i Norge.
        Lag en forbedret annonsetittel og annonsetekst basert på faktaene under.

        FAKTA:
        - Type: ${listingType}
        - Tittel: "${title}"
        - Sted: ${city}
        - Soverom: ${bedroom != null ? bedroom : "Ikke spesifisert"}
        - Maks gjester: ${guest != null ? guest : "Ikke spesifisert"}
        - Fasiliteter: ${amenities.join(", ") || "Ikke spesifisert"}
        - Eiers notater: "${notes}"

        REGLER FOR TEKSTEN:
        1. **Tone of voice**:
           - Nordisk nøktern og troverdig.
           - Varm og innbydende, men dempet og konkret.
           - Mindre amerikansk entusiastisk stil; unngå hype, superlativer
             og overdrevne utrop.
           - Skriv i stil med norske bolig-/ferieannonser.
           - Unngå "meglerspråk" og overdrivelser.
        2. **Tittel**:
           - Maks 120 tegn.
           - Må være spesifikk og nyttig (sted, type, styrker).
           - Bygg videre på brukerens opprinnelige tittel, ikke ignorer den.
        3. **Beskrivelse i tre faste seksjoner**:
           - atmosphere: stemning, hva slags opphold, hvem stedet passer for.
           - amenities: konkrete fasiliteter og praktisk komfort.
           - location: beliggenhet, avstander og praktisk transportinfo.
           - Hver seksjon: 2-4 setninger, konkret og lettlest for mobil.
           - Ikke dupliser samme informasjon på tvers av seksjonene.
        4. **Språk**: Norsk (Bokmål).
        5. **Lengde beskrivelse**: Ca. 200-300 ord. Perfekt for lesing på mobil.
        6. **Søkeoptimalisering for semantisk/vector-søk**:
           - Inkluder konkrete fakta naturlig: sted, boligtype, fasiliteter,
             kapasitet eller bruksområder hvis relevant.
           - Bruk tydelige, konkrete ord som en gjest faktisk ville søkt etter.
           - Unngå nøkkelord-spam; teksten må fortsatt lese naturlig.
           - Ikke finn opp fakta som ikke finnes i input.

        Returner kun gyldig JSON med feltene:
        {
          "title": "forbedret tittel",
          "sections": {
            "atmosphere": "tekst",
            "amenities": "tekst",
            "location": "tekst"
          }
        }
      `;

      try {
        const response = await ai.models.generateContent({
          model: DESCRIPTION_MODEL,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                sections: {
                  type: Type.OBJECT,
                  properties: {
                    atmosphere: { type: Type.STRING },
                    amenities: { type: Type.STRING },
                    location: { type: Type.STRING },
                  },
                  required: ["atmosphere", "amenities", "location"],
                },
              },
              required: ["title", "sections"],
            },
          },
        });
        const responseText = response.text?.trim() ?? "";

        if (!responseText) {
          throw new HttpsError(
            "internal",
            "Description generation returned an empty response",
          );
        }

        const parsedResponse = parseGeneratedListing(responseText);
        const generatedSections = trimSections(parsedResponse.sections);
        const generatedDescription = [
          generatedSections.atmosphere,
          generatedSections.amenities,
          generatedSections.location,
        ]
          .filter(Boolean)
          .join("\n\n");
        const generatedTitle = (parsedResponse.title?.trim() ?? title).slice(
          0,
          120,
        );

        if (!generatedDescription) {
          throw new HttpsError(
            "internal",
            "Description generation returned incomplete response",
          );
        }

        return {
          title: generatedTitle.slice(0, 120),
          description: generatedDescription,
        };
      } catch (err) {
        if (err instanceof HttpsError) {
          throw err;
        }

        console.error("AI Description Error:", err);
        throw new HttpsError("internal", "Failed to generate description");
      }
    },
  );
