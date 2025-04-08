import React, { useEffect } from "react";
import useUserStore from "@/store/useUserStore";
import AppLayout from "@/components/AppLayout";
import { useThemeStore } from "@/store/selectors/themeStore";
import RoutesProvider from "@/routes/RoutesProvider";

const App: React.FC = () => {
  const { user, setUser } = useUserStore();
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

  console.log("USER STATE salim", user);

  return (
    <AppLayout>
      <RoutesProvider />
    </AppLayout>
  );
};

export default App;
