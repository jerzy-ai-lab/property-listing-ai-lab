import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpFormSchema, type SignUpFormData } from "../signUpFormSchema";
import {
  signUp,
  signInWithGoogle,
  getAuthErrorMessage,
} from "@/api/auth";
import { createUserProfile } from "@/api/users";

// Hook for sign up form
export const useSignUpForm = () => {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [redirectPath, setRedirectPath] = useState<string>(
    "/email-verification"
  );
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
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
        navigate(redirectPath, { replace: true });
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate, redirectPath]);

  const onSubmit = async (data: SignUpFormData) => {
    setError(null);
    try {
      const credential = await signUp(data.email, data.password);
      await createUserProfile(credential.user.uid, {
        email: data.email,
      });

      reset();
      setIsSuccess(true);
    } catch (err) {
      setError(getAuthErrorMessage(err));
    }
  };

  const handleGoogleSignUp = async () => {
    setError(null);
    try {
      const credential = await signInWithGoogle();
      await createUserProfile(credential.user.uid, {
        email: credential.user.email ?? "",
      });

      setRedirectPath("/");
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
    handleGoogleSignUp,
  };
};
