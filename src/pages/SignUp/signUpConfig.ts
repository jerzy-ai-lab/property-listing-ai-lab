import type { SuccessMessageConfig } from "@/types/successMessage";

/* SignUp page configuration */
export type PageHeaderConfig = {
  title: string;
  subtitle: string;
};

export type { SuccessMessageConfig };

export const PAGE_HEADER_CONFIG: PageHeaderConfig = {
  title: "Sign Up",
  subtitle: "Create your account",
};

export const SUCCESS_MESSAGE: SuccessMessageConfig = {
  title: "Success!",
  message: "Account created successfully!",
};
