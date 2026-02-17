import { useState } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/config/firebaseConfig";
import type {
  UseFormGetValues,
  UseFormSetValue,
  UseFormTrigger,
} from "react-hook-form";
import {
  addListingFormSchema,
  type AddListingFormInput,
} from "../addListingFormSchema";

type GenerateDescriptionRequest = {
  title: string;
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

type UseGenerateDescriptionParams = {
  getValues: UseFormGetValues<AddListingFormInput>;
  setValue: UseFormSetValue<AddListingFormInput>;
  trigger: UseFormTrigger<AddListingFormInput>;
  setError: (message: string | null) => void;
};

export interface UseGenerateDescriptionReturn {
  isGenerating: boolean;
  handleGenerateDescription: () => Promise<void>;
}

// Hook for generating listing title and description with AI
export const useGenerateDescription = ({
  getValues,
  setValue,
  trigger,
  setError,
}: UseGenerateDescriptionParams): UseGenerateDescriptionReturn => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateDescription = async (): Promise<void> => {
    setError(null);

    const isValid = await trigger();
    if (!isValid) return;

    const parsed = addListingFormSchema.parse(getValues());
    setIsGenerating(true);

    try {
      const generateDescription = httpsCallable<
        GenerateDescriptionRequest,
        GenerateDescriptionResponse
      >(functions, "generateDescription");

      const { data } = await generateDescription({
        title: parsed.title,
        city: parsed.city.trim(),
        amenities: parsed.amenities,
        notes: parsed.description.trim(),
        bedroom: parsed.bedroom,
        guest: parsed.guest,
      });

      const generatedTitle = data.title?.trim() || parsed.title;
      const generatedDescription = data.description?.trim() ?? "";

      if (!generatedDescription) {
        throw new Error("AI returned an empty description.");
      }

      setValue("title", generatedTitle, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });

      setValue("description", generatedDescription, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate title and description. Please try again.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    handleGenerateDescription,
  };
};
