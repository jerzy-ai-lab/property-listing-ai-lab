import { z } from "zod";
import { PHONE_REGEX } from "./regex";

// Helper function to validate phone number digit count
const isValidPhoneDigits = (value: string): boolean => {
  const digitsOnly = value.replace(/\D/g, "");
  return digitsOnly.length >= 8 && digitsOnly.length <= 10;
};

/* Zod schemas for forms validation */

// Name schema
export const nameSchema = z
  .string()
  .trim()
  .min(2, "Must be at least 2 characters long")
  .max(30, "Must be at most 30 characters");

// Email schema
export const emailSchema = z
  .string()
  .trim()
  .min(1, "This field is required")
  .max(30, "Must be at most 30 characters")
  .pipe(z.email("Please enter a valid email address"));

// Phone schema
export const phoneSchema = z
  .string()
  .trim()
  .min(1, "This field is required")
  .regex(PHONE_REGEX, "Phone number contains invalid characters")
  .refine(
    isValidPhoneDigits,
    "Please enter a valid phone number (8-10 digits)"
  );

// Subject schema
export const subjectSchema = z
  .string()
  .trim()
  .max(50, "Must be at most 50 characters");

// Message schema
export const messageSchema = z
  .string()
  .trim()
  .min(10, "Must be at least 10 characters long")
  .max(400, "Must be at most 400 characters");

// Password schema (for registration – full validation)
export const passwordSchema = z
  .string()
  .min(8, "Must be at least 8 characters long")
  .max(50, "Must be at most 50 characters")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  .regex(/[a-z]/, "Must contain at least one lowercase letter")
  .regex(/[0-9]/, "Must contain at least one number")
  .regex(/[\W_]/, "Must contain at least one special character");

// Sign-in password schema (only required – no complexity rules)
export const signInPasswordSchema = z
  .string()
  .min(1, "Password is required");

// Confirm password schema
export const confirmPasswordSchema = z
  .string()
  .min(1, "Please confirm your password");
