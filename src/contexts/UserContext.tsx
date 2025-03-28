
import React, { createContext, useContext, useState, useEffect } from "react";

type UserRole = "customer" | "provider" | null;

interface UserContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check localStorage on initial load
  useEffect(() => {
    const savedRole = localStorage.getItem("userRole") as UserRole;
    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    
    if (savedRole) {
      setUserRole(savedRole);
    }
    
    if (authStatus) {
      setIsAuthenticated(true);
    }
  }, []);

  // Save to localStorage when values change
  useEffect(() => {
    if (userRole) {
      localStorage.setItem("userRole", userRole);
    }
    localStorage.setItem("isAuthenticated", isAuthenticated.toString());
  }, [userRole, isAuthenticated]);

  return (
    <UserContext.Provider value={{ userRole, setUserRole, isAuthenticated, setIsAuthenticated }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
