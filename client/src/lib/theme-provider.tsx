import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "./queryClient";
import { useToast } from "@/hooks/use-toast";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "nivalus-ui-theme",
  ...props
}: ThemeProviderProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [theme, setTheme] = useState<Theme>(
    () => {
      // First try to get theme from user profile, then from local storage
      if (user?.theme_preference && ["light", "dark", "system"].includes(user.theme_preference)) {
        return user.theme_preference as Theme;
      }
      return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
    }
  );

  // Update theme when user preferences change
  useEffect(() => {
    if (user?.theme_preference && ["light", "dark", "system"].includes(user.theme_preference)) {
      setTheme(user.theme_preference as Theme);
    }
  }, [user?.theme_preference]);

  useEffect(() => {
    const root = window.document.documentElement;
    
    root.classList.remove("light", "dark");
    
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      
      root.classList.add(systemTheme);
      return;
    }
    
    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      // Save theme to local storage
      localStorage.setItem(storageKey, newTheme);
      
      // Update state
      setTheme(newTheme);
      
      // If user is logged in, save preference to database
      if (user) {
        apiRequest("PATCH", "/api/user/theme", { theme: newTheme })
          .catch((error) => {
            toast({
              title: "Theme preference not saved",
              description: "Could not save your theme preference to your profile.",
              variant: "destructive",
            });
            console.error("Error saving theme preference:", error);
          });
      }
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  
  return context;
};
