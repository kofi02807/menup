// src/context/AuthContext.tsx (You'll need to create a 'context' folder)
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the type for the user object
interface User {
  id: string;
  email: string;
  restaurantName: string;
}

// Define the shape of the Context
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

// Create the Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- Provider Component ---
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // In a real app, you'd check localStorage for a persisted user/token
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!user;

  const login = (userData: User, token: string) => {
    // Save token (e.g., to localStorage) and set the user state
    localStorage.setItem('authToken', token);
    setUser(userData);
  };

  const logout = () => {
    // Clear token and user state
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- Custom Hook for easy access ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};