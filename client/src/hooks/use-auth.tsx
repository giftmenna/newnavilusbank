import { createContext, ReactNode, useContext, useEffect } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { InsertUser, User, loginUserSchema, insertUserSchema } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { z } from "zod";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<User, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<User, Error, RegisterData>;
};

type LoginData = z.infer<typeof loginUserSchema>;
type RegisterData = z.infer<typeof insertUserSchema>;

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const {
    data: user,
    error,
    isLoading,
    refetch,
  } = useQuery<User | null, Error>({
    queryKey: ["/api/user"],
    queryFn: async ({ queryKey }) => {
      try {
        const token = localStorage.getItem("nivalus_auth_token");
        if (!token) return null;
        
        const res = await fetch(queryKey[0] as string, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (res.status === 401) {
          localStorage.removeItem("nivalus_auth_token");
          return null;
        }
        
        if (!res.ok) {
          throw new Error(`${res.status}: ${res.statusText}`);
        }
        
        return await res.json();
      } catch (error) {
        console.error("Auth error:", error);
        localStorage.removeItem("nivalus_auth_token");
        return null;
      }
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      return await res.json();
    },
    onSuccess: (userData: User & { auth_token: string }) => {
      // Store auth token in localStorage
      localStorage.setItem("nivalus_auth_token", userData.auth_token);
      
      // Update user data in query cache
      queryClient.setQueryData(["/api/user"], userData);
      
      toast({
        title: "Login successful",
        description: "Welcome back to Nivalus Bank!",
      });
      
      // Redirect based on user role
      if (userData.role === 'admin') {
        setLocation("/admin");
      } else {
        setLocation("/dashboard");
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: RegisterData) => {
      const res = await apiRequest("POST", "/api/register", userData);
      return await res.json();
    },
    onSuccess: (userData: User & { auth_token: string }) => {
      // Store auth token in localStorage
      localStorage.setItem("nivalus_auth_token", userData.auth_token);
      
      // Update user data in query cache
      queryClient.setQueryData(["/api/user"], userData);
      
      toast({
        title: "Registration successful",
        description: "Welcome to Nivalus Bank!",
      });
      
      // Redirect to dashboard
      setLocation("/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("nivalus_auth_token");
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    },
    onSuccess: () => {
      // Remove auth token from localStorage
      localStorage.removeItem("nivalus_auth_token");
      
      // Clear user data from query cache
      queryClient.setQueryData(["/api/user"], null);
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      
      // Redirect to home page
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    // Check for token on initial load
    const token = localStorage.getItem("nivalus_auth_token");
    if (token) {
      refetch();
    }
  }, [refetch]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
