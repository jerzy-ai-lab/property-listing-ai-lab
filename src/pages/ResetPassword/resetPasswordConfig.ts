import type { SuccessMessageConfig } from "@/types/successMessage";

/* ResetPassword page configuration */
export type PageHeaderConfig = {
  title: string;
  subtitle: string;
};

export type { SuccessMessageConfig };

export const PAGE_HEADER_CONFIG: PageHeaderConfig = {
  title: "Reset Password",
  subtitle: "Used Google before? Sign in with Google instead.",
};

export const SUCCESS_MESSAGE: SuccessMessageConfig = {
  title: "Success!",
  message:
    "Password reset link sent! Please check your email and click the link to reset your password.",
};
