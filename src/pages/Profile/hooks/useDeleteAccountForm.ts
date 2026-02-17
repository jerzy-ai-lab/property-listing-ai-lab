import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  getDeleteAccountFormSchema,
  type DeleteAccountFormData,
} from "../deleteAccountFormSchema";
import {
  deleteUserAccount,
  getAuthErrorMessage,
  isGoogleUser,
  reauthenticateUser,
} from "@/api/auth";
import { deleteUserProfile } from "@/api/users";
import { useAuthContext } from "@/contexts/AuthContext";

// Hook for delete account form
export const useDeleteAccountForm = () => {
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const isGoogle = useMemo(() => {
    return user ? isGoogleUser(user) : false;
  }, [user]);

  const schema = useMemo(() => {
    return getDeleteAccountFormSchema(isGoogle);
  }, [isGoogle]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DeleteAccountFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: DeleteAccountFormData) => {
    if (!user) {
      setError("No user is currently signed in");
      return;
    }

    setError(null);

    try {
      await reauthenticateUser(data.password);
      await deleteUserProfile(user.uid);
      await deleteUserAccount();
      reset();
      navigate("/sign-in", { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : getAuthErrorMessage(err) ??
              "Failed to delete account. Please try again."
      );
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    resetForm: reset,
    isLoading: isSubmitting,
    error,
    setError,
    isGoogleUser: isGoogle,
  };
};
