import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import fr from "./locales/fr.json";

i18n
  .use(LanguageDetector) // Détection automatique de la langue du navigateur
  .use(initReactI18next) // Intégration avec React
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr }
    },
    fallbackLng: "en", // Si la langue n'est pas disponible, on met anglais par défaut
    interpolation: {
      escapeValue: false // Permet d'afficher du HTML dans les traductions
    }
  });

export default i18n;
