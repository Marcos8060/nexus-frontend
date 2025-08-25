"use client";
import { useState, createContext, useContext, ReactNode } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { APP_API_URL } from "@/lib/api-endpoints";

// Define user type (adjust fields to match Django's JWT payload)
type User = {
  id: string;
  email: string;
  username: string;
  role: string;
} | null;

type AuthContextType = {
  user: User;
  loginUser: (email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User>(null);

  const loginUser = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        APP_API_URL.LOGIN,
        { email, password },
        { withCredentials: true } // needed so cookie from Django is stored
      );

      if (response.status === 200) {
        // fetch user info from /api/auth/me
        const me = await axios.get(APP_API_URL.MY_CREDENTIALS, { withCredentials: true });
        setUser(me.data);
        router.push("/dashboard"); // optional redirect
      }
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loginUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for consuming context
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
