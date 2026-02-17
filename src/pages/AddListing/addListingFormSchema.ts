import { z } from "zod";

/* AddListing form schema */
const addListingFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(120, "Max 120 characters"),
  street: z.string().min(1, "Street is required").max(30, "Max 30 characters"),
  zipCode: z
    .string()
    .trim()
    .min(1, "Zip Code is required")
    .min(4, "Min 4 characters")
    .max(4, "Max 4 characters"),
  city: z
    .string()
    .trim()
    .min(1, "City is required")
    .max(20, "Max 20 characters"),
  country: z.string().trim().min(1, "Country is required"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(5000, "Max 5000 characters"),
  bedroom: z
    .string()
    .min(1, "Bedrooms is required")
    .transform(Number)
    .pipe(z.number().min(0, "Min 0").max(20, "Max 20")),
  guest: z.coerce.number().min(1, "Guests is required"),
  price: z.coerce.number().min(1, "Price is required"),
  amenities: z.array(z.string()).min(3, "Select at least 3 amenities"),
  image: z.string().min(1, "Property image is required"),
});

export type AddListingFormData = z.infer<typeof addListingFormSchema>;
export type AddListingFormInput = z.input<typeof addListingFormSchema>;
export { addListingFormSchema };
