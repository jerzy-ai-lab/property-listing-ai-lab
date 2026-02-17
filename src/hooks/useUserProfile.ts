import { useState, useEffect } from "react";
import { listenToUserProfile } from "@/api/users";
import { useAuthContext } from "@/contexts/AuthContext";
import type { UserProfile } from "@/types/user";

export interface UseUserProfileReturn {
  userProfile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
}

// Hook for fetching user profile data
export const useUserProfile = (): UseUserProfileReturn => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user) {
      setUserProfile(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const unsubscribe = listenToUserProfile(
      user.uid,
      (profile) => {
        setUserProfile(profile);
        setIsLoading(false);
      },
      (err) => {
        setError(
          err instanceof Error ? err.message : "Failed to load user profile"
        );
        setUserProfile(null);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return { userProfile, isLoading, error, setError };
};
