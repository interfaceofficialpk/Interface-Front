import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

export default function ReverseProtectedRoute({ children }) {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated()) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}
