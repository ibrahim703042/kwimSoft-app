import { create } from "zustand";

export type Theme = "light" | "dark" | "system";

interface ThemeState {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
    theme: getInitialTheme(),
    setTheme: (theme) => {
        applyTheme(theme);
        localStorage.setItem("theme", theme);
        set({ theme });
    },
}));

// function getInitialTheme(): Theme {
//   const stored = localStorage.getItem("theme") as Theme | null;
//   if (stored) return stored;

//   const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
//   return prefersDark ? "dark" : "light";
// }

function getInitialTheme(): Theme {
    const stored = localStorage.getItem("theme");

    if (stored === "light" || stored === "dark" || stored === "system") {
        return stored;
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
}


function applyTheme(theme: Theme) {
    const html = document.documentElement;

    if (theme === "system") {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        html.classList.toggle("dark", prefersDark);
    } else {
        html.classList.toggle("dark", theme === "dark");
    }
}
