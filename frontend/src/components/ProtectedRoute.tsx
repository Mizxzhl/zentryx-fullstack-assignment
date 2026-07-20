import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // Get JWT from Local Storage
  const token = localStorage.getItem("token");

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, show the protected page
  return <>{children}</>;
};

export default ProtectedRoute;


// ProtectedRoute wraps another page (like Dashboard). If a token exists, it renders its children; otherwise it redirects to Login.