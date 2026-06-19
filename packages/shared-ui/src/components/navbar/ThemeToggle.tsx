import React from "react";
import { Moon, Sun, Laptop2 } from "lucide-react";
import { useThemeStore, type Theme } from "../../stores/useThemeStore";
import { cn } from "../../lib/utils";

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useThemeStore();

  const themes = [
    { label: "Light", value: "light", icon: <Sun size={16} /> },
    { label: "Dark", value: "dark", icon: <Moon size={16} /> },
    { label: "System", value: "system", icon: <Laptop2 size={16} /> },
  ];

  return (
    <div className="relative group">
      <button
        type="button"
        className="p-1 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
        aria-label="Theme Menu"
      >
        {themes.find((t) => t.value === theme)?.icon}
      </button>
      <div className="absolute right-0 mt-2 w-32 bg-popover text-popover-foreground border border-border rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-50">
        {themes.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setTheme(t.value as Theme)}
            className={cn(
              "flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground",
              theme === t.value && "font-semibold bg-muted"
            )}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeToggle;
