import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  resetPasswordFormSchema,
  type ResetPasswordFormData,
} from "../resetPasswordFormSchema";
import { resetPassword, getAuthErrorMessage } from "@/api/auth";

// Hook for reset password form
export const useResetPasswordForm = () => {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      email: "",
    },
    mode: "onBlur",
  });

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        setIsSuccess(false);
        navigate("/sign-in");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setError(null);
    try {
      await resetPassword(data.email);
      reset();
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
  };
};
