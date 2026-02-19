export interface Entreprise {
  id: string;
  name: string;
  logo?: string;
}

export interface Etablissement {
  id: string;
  name: string;
  entrepriseId: string;
}

export interface TenantState {
  entrepriseId: string | null;
  etablissementId: string | null;
  entreprises: Entreprise[];
  etablissements: Etablissement[];
}

export interface TenantActions {
  setEntreprise: (entrepriseId: string) => void;
  setEtablissement: (etablissementId: string) => void;
  setEntreprises: (entreprises: Entreprise[]) => void;
  setEtablissements: (etablissements: Etablissement[]) => void;
  clearTenant: () => void;
}

export type TenantStore = TenantState & TenantActions;
