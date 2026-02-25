import React, { useState, useRef, useEffect } from "react";
import { useLanguageStore } from "../../stores/useLanguageStore";
import { Globe } from "lucide-react";

export interface LanguageOption {
  code: string;
  name: string;
  flag?: string;
}

interface LanguageSwitcherProps {
  languages?: LanguageOption[];
}

const defaultLanguages: LanguageOption[] = [
  { code: "fr", name: "Français" },
  { code: "en", name: "English" },
];

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  languages = defaultLanguages,
}) => {
  const { language, setLanguage } = useLanguageStore();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setShowMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLang = languages.find((l) => l.code === language);

  return (
    <div className="relative" ref={menuRef}>
      <div
        className="h-6 w-6 cursor-pointer hover:scale-105 transition-transform flex items-center justify-center"
        onClick={() => setShowMenu(!showMenu)}
      >
        {currentLang?.flag ? (
          <img
            src={currentLang.flag}
            alt="Language"
            className="rounded-full border w-full"
          />
        ) : (
          <div className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <Globe size={16} />
            <span className="uppercase text-xs font-medium">{currentLang?.code || language}</span>
          </div>
        )}
      </div>
      {showMenu && (
        <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 border rounded-md shadow-lg z-50">
          {languages.map((lang) => (
            <div
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${
                language === lang.code ? "bg-gray-50 dark:bg-gray-700" : ""
              }`}
            >
              {lang.flag ? (
                <img
                  src={lang.flag}
                  alt={lang.name}
                  className="h-4 w-4 rounded-full"
                />
              ) : (
                <span className="h-4 w-4 text-xs font-medium flex items-center justify-center uppercase">
                  {lang.code}
                </span>
              )}
              <span className="text-sm">{lang.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
