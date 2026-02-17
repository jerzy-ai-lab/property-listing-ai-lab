import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut, getAuthErrorMessage } from "@/api/auth";

export interface UseSignOutReturn {
  handleSignOut: () => Promise<void>;
  isSigningOut: boolean;
  error: string | null;
  setError: (error: string | null) => void;
}

// Hook for user sign out
export const useSignOut = (): UseSignOutReturn => {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSignOut = async () => {
    setIsSigningOut(true);
    setError(null);
    try {
      await signOut();
      navigate("sign-in");
    } catch (err) {
      setError(getAuthErrorMessage(err));
      navigate("sign-in");
    } finally {
      setIsSigningOut(false);
    }
  };

  return { handleSignOut, isSigningOut, error, setError };
};
