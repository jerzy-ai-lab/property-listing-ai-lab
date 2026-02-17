import {
  createContext,
  useEffect,
  useState,
  useContext,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import { onIdTokenChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "@/config/firebaseConfig";
import { updateUser } from "@/api/auth";

export interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  refreshUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/* AuthProvider component to manage authentication state */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onIdTokenChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshUser = useCallback(async (): Promise<User | null> => {
    const updatedUser = await updateUser();
    if (updatedUser) {
      setUser(updatedUser);
    }
    return updatedUser;
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

/* eslint-disable react-refresh/only-export-components */
export const useAuthContext = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within a AuthProvider");
  }
  return context;
};
