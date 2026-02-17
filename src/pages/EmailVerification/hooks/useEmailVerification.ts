import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { emailVerification, getAuthErrorMessage } from "@/api/auth";
import { useRedirectFrom } from "@/hooks/useRedirectFrom";

export interface UseEmailVerificationReturn {
  error: string | null;
  setError: (error: string | null) => void;
  isSuccess: boolean;
  isLoading: boolean;
  isAuthLoading: boolean;
  emailVerified: boolean;
  handleResendVerificationEmail: () => Promise<void>;
}

// Hook for email verification
export const useEmailVerification = (): UseEmailVerificationReturn => {
  const [emailVerified, setEmailVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { user, isLoading: isAuthLoading, refreshUser } = useAuthContext();
  const navigate = useNavigate();
  const { from } = useRedirectFrom();

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (!user) {
      navigate("/sign-in", { replace: true });
      return;
    }

    const checkVerificationStatus = async () => {
      try {
        const updatedUser = await refreshUser();
        if (updatedUser) {
          const isVerified = updatedUser.emailVerified;
          setEmailVerified(isVerified);

          if (isVerified) {
            // Redirect to requested location or home page
            navigate(from, { replace: true });
            return;
          }
        }
      } catch (err) {
        setError(getAuthErrorMessage(err));
      }
    };

    // Check immediately
    checkVerificationStatus();

    // Set interval if email is not verified yet
    const interval = setInterval(checkVerificationStatus, 5000);
    return () => clearInterval(interval);
  }, [user, from, isAuthLoading, refreshUser, navigate]);

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        setIsSuccess(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  const handleResendVerificationEmail = async (): Promise<void> => {
    if (user?.emailVerified) {
      return;
    }

    try {
      setError(null);
      setIsLoading(true);
      await emailVerification();
      setIsSuccess(true);
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    error,
    setError,
    isLoading,
    isSuccess,
    emailVerified,
    handleResendVerificationEmail,
    isAuthLoading,
  };
};
