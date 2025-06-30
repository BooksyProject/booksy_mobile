"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextProps {
  profile: any;
  setProfile: React.Dispatch<React.SetStateAction<any>>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<any>(null);

  const logout = () => {
    console.log("vo");
    AsyncStorage.removeItem("userId");
    AsyncStorage.removeItem("token");

    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ profile, setProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
