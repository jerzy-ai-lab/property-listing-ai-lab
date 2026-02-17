import { z } from "zod";
import { emailSchema, signInPasswordSchema } from "@/utils/zodSchemas";

/* Sign in form schema */
export const signInFormSchema = z.object({
  email: emailSchema,
  password: signInPasswordSchema,
});

export type SignInFormData = z.infer<typeof signInFormSchema>;
