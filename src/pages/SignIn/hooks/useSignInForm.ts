import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInFormSchema, type SignInFormData } from "../signInFormSchema";
import {
  signIn,
  getAuthErrorMessage,
  signInWithGoogle,
} from "@/api/auth";
import { useRedirectFrom } from "@/hooks/useRedirectFrom";
import { createUserProfile } from "@/api/users";

// Hook for sign in form
export const useSignInForm = () => {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { from } = useRedirectFrom();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        setIsSuccess(false);
        // Redirect to requested location or home page
        navigate(from, { replace: true });
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate, from]);

  const onSubmit = async (data: SignInFormData) => {
    setError(null);
    try {
      await signIn(data.email, data.password);
      reset();
      setIsSuccess(true);
    } catch (err) {
      setError(getAuthErrorMessage(err));
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      const credential = await signInWithGoogle();
      await createUserProfile(credential.user.uid, {
        email: credential.user.email ?? "",
      });

      setIsSuccess(true);
    } catch (err) {
      setError(getAuthErrorMessage(err));
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    isSuccess,
    errors,
    resetForm: reset,
    isLoading: isSubmitting,
    error,
    setError,
    handleGoogleSignIn,
  };
};
