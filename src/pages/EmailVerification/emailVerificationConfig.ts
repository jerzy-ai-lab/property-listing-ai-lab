import type { SuccessMessageConfig } from "@/types/successMessage";

export type PageHeaderConfig = {
  title: string;
  subtitle: string;
};

export type PageSubtitleConfig = {
  subtitle: string;
};

export type { SuccessMessageConfig };

export const PAGE_HEADER_CONFIG: PageHeaderConfig = {
  title: "Email Verification",
  subtitle: "Check your inbox to complete registration",
};

export const PAGE_SUBTITLE_CONFIG: PageSubtitleConfig = {
  subtitle: "Didn't receive the email? Check your spam folder or click below.",
};

export const EMAIL_SENT_MESSAGE: SuccessMessageConfig = {
  title: "Email Sent!",
  message: "Verification email has been sent. Please check your inbox.",
};

export const EMAIL_VERIFIED_MESSAGE: SuccessMessageConfig = {
  title: "Email Verified!",
  message: "Redirecting, please wait...",
};
