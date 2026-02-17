import type { SuccessMessageConfig } from "@/types/successMessage";

export type PageHeaderConfig = {
  title: string;
  subtitle: string;
};

export type AmenityOption = {
  id: string;
  label: string;
};

export type { SuccessMessageConfig };

export type CountryOption = {
  value: string;
  label: string;
};

export const PAGE_HEADER_CONFIG: PageHeaderConfig = {
  title: "Add Listing",
  subtitle: "List your property for rent",
};

export const SUCCESS_MESSAGE: SuccessMessageConfig = {
  title: "Success!",
  message: "Listing added successfully!",
};

export const COUNTRY_OPTIONS: CountryOption[] = [
  { value: "norway", label: "Norway" },
];

export const AMENITIES_OPTIONS: AmenityOption[] = [
  { id: "wifi", label: "Wifi" },
  { id: "washer", label: "Washer" },
  { id: "bbq_grill", label: "BBQ grill" },
  { id: "coffee_maker", label: "Coffee maker" },
  { id: "full_kitchen", label: "Full kitchen" },
  { id: "indoor_fireplace", label: "Indoor fireplace" },
];
