import React, { useState, useRef, useEffect } from "react";
import france from "../../assets/img/lang/france.png";
import english from "../../assets/img/lang/english.png";
import { useLanguageStore } from "@/store/selectors/useLanguageStore";

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguageStore();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: "fr", name: "Français", flag: france },
    { code: "en", name: "English", flag: english },
  ];

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
        className="h-6 w-6 cursor-pointer hover:scale-105 transition-transform"
        onClick={() => setShowMenu(!showMenu)}
      >
        <img src={currentLang?.flag} alt="Language" className="rounded-full border w-full" />
      </div>
      {showMenu && (
        <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 border rounded-md shadow-lg z-50">
          {languages.map((lang) => (
            <div
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            >
              <img src={lang.flag} alt={lang.name} className="h-4 w-4 rounded-full" />
              <span className="text-sm">{lang.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
