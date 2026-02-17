import type { SuccessMessageConfig } from "@/types/successMessage";

/* Contact page configuration */
export type PageHeaderConfig = {
  title: string;
  subtitle: string;
};

export type { SuccessMessageConfig };

export const PAGE_HEADER_CONFIG: PageHeaderConfig = {
  title: "Contact",
  subtitle: "Get in touch with us",
};

export const SUCCESS_MESSAGE: SuccessMessageConfig = {
  title: "Success!",
  message: "Message sent successfully!",
};
