import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { Spinner } from "../Spinner/Spinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/* ProtectedRoute component */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuthContext();
  const location = useLocation();

  if (isLoading) {
    return <Spinner />;
  }

  if (!user) {
    return (
      // Save current location for redirect after sign-in
      <Navigate to="/sign-in" state={{ from: location.pathname }} replace />
    );
  }

  if (!user.emailVerified) {
    return (
      <Navigate
        to="/email-verification"
        // Save current location for redirect after sign-in
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return children;
}
