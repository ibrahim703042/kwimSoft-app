import { create } from "zustand";
import { TenantStore, Entreprise, Etablissement } from "./types";

export const useTenantStore = create<TenantStore>((set) => ({
  // Initial state from localStorage
  entrepriseId: localStorage.getItem("entrepriseId"),
  etablissementId: localStorage.getItem("etablissementId"),
  entreprises: JSON.parse(localStorage.getItem("entreprises") || "[]"),
  etablissements: JSON.parse(localStorage.getItem("etablissements") || "[]"),

  setEntreprise: (entrepriseId: string) => {
    localStorage.setItem("entrepriseId", entrepriseId);
    set({ entrepriseId, etablissementId: null }); // Reset etablissement when changing entreprise
  },

  setEtablissement: (etablissementId: string) => {
    localStorage.setItem("etablissementId", etablissementId);
    set({ etablissementId });
  },

  setEntreprises: (entreprises: Entreprise[]) => {
    localStorage.setItem("entreprises", JSON.stringify(entreprises));
    set({ entreprises });
  },

  setEtablissements: (etablissements: Etablissement[]) => {
    localStorage.setItem("etablissements", JSON.stringify(etablissements));
    set({ etablissements });
  },

  clearTenant: () => {
    localStorage.removeItem("entrepriseId");
    localStorage.removeItem("etablissementId");
    localStorage.removeItem("entreprises");
    localStorage.removeItem("etablissements");
    set({ 
      entrepriseId: null, 
      etablissementId: null,
      entreprises: [],
      etablissements: []
    });
  },
}));
