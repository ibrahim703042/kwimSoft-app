import React from "react";
import { Moon, Sun, Laptop2 } from "lucide-react";
import { useThemeStore } from "../../store/selectors/themeStore";

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
                className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                aria-label="Theme Menu"
            >
                {
                    themes.find((t) => t.value === theme)?.icon
                }
            </button>
            <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 border rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-50">
                {themes.map((t) => (
                    <button
                        key={t.value}
                        onClick={() => setTheme(t.value)}
                        className={`flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${theme === t.value ? "font-semibold" : ""
                            }`}
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
