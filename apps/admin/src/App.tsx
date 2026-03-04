import React, { useEffect } from "react";
import { useAuthStore } from "./core/auth";
import { AppShell } from "./app/AppShell";
import { useThemeStore } from "@kwim/shared-ui";
import { setApiClient } from "@/core/crud";
import { apiClient } from "@/core/api";

setApiClient(apiClient);

const App: React.FC = () => {
  const { setUser } = useAuthStore();
  const { theme } = useThemeStore();

  // Load user on first mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [setUser]);

  // Apply theme on load and on theme change
  useEffect(() => {
    const html = document.documentElement;

    if (theme === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      html.classList.toggle("dark", prefersDark);
    } else {
      html.classList.toggle("dark", theme === "dark");
    }

    // Optional: respond to system theme changes if user selected "system"
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (e: MediaQueryListEvent) => {
      if (theme === "system") {
        html.classList.toggle("dark", e.matches);
      }
    };

    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [theme]);

  return <AppShell />;
};

export default App;
