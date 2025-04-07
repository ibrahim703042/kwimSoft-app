import { create } from "zustand";
import i18n from "../../i18n";


// Définition du type de notre état
type LanguageState = {
  language: string;
  setLanguage: (lang: string) => void;
};

// Création du store Zustand
export const useLanguageStore = create<LanguageState>((set) => ({
  language: i18n.language, // Récupère la langue actuelle d'i18n
  setLanguage: (lang: string) => {
    i18n.changeLanguage(lang); // Change la langue dans i18next
    set({ language: lang }); // Met à jour l'état dans Zustand
  }
}));
