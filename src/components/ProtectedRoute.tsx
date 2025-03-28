
import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: "customer" | "provider";
}

const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
  const { userRole, isAuthenticated } = useUser();
  const { toast } = useToast();

  if (!isAuthenticated) {
    toast({
      title: "Authentication Required",
      description: "Please sign in to continue.",
      variant: "destructive",
    });
    return <Navigate to="/select-user-type" replace />;
  }

  if (userRole !== allowedRole) {
    toast({
      title: "Access Denied",
      description: `This section is for ${allowedRole}s only.`,
      variant: "destructive",
    });
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
