import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";

interface AuthContextProps {
  isAuthenticated: boolean;
  loading: boolean; // New loading state
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthentication: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  loading: true, // Default to true while checking authentication
  setIsAuthenticated: () => {},
  checkAuthentication: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}


export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // New loading state
  const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:3000';
  
  const checkAuthentication = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/protected`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        setIsAuthenticated(true);
      } else if (response.status === 401 || response.status === 403) {
        const refreshResponse = await fetch(`${API_BASE_URL}/refresh-token`, {
          method: "POST",
          credentials: "include",
        });
        if (refreshResponse.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error("Failed to authenticate:", err);
      setIsAuthenticated(false);
    } finally {
      setLoading(false); // Mark loading as complete
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loading, setIsAuthenticated, checkAuthentication }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
