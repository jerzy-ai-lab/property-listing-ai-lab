import type { SuccessMessageConfig } from "@/types/successMessage";

/* SignIn page configuration */
export type PageHeaderConfig = {
  title: string;
  subtitle: string;
};

export type { SuccessMessageConfig };

export type Link = {
  to: string;
  label: string;
};

export const PAGE_HEADER_CONFIG: PageHeaderConfig = {
  title: "Sign In",
  subtitle: "Sign In to your account",
};

export const SUCCESS_MESSAGE: SuccessMessageConfig = {
  title: "Success!",
  message: "You have been successfully signed in. Welcome back!",
};

export const SIGN_IN_FORM_LINKS: Link[] = [
  {
    to: "/sign-up",
    label: "Don't have an account? Sign up",
  },
  {
    to: "/reset-password",
    label: "Forgot your password?",
  },
];
