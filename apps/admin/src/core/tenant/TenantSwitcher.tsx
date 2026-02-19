import { useTenantStore } from "./tenant.store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, MapPin } from "lucide-react";

export function TenantSwitcher() {
  const {
    entrepriseId,
    etablissementId,
    entreprises,
    etablissements,
    setEntreprise,
    setEtablissement,
  } = useTenantStore();

  const currentEntreprise = entreprises.find(e => e.id === entrepriseId);
  const availableEtablissements = etablissements.filter(
    e => e.entrepriseId === entrepriseId
  );

  return (
    <div className="flex items-center gap-2">
      {/* Entreprise Selector */}
      {entreprises.length > 0 && (
        <Select value={entrepriseId || undefined} onValueChange={setEntreprise}>
          <SelectTrigger className="w-[180px] bg-background">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Select company" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {entreprises.map((entreprise) => (
              <SelectItem key={entreprise.id} value={entreprise.id}>
                {entreprise.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Etablissement Selector */}
      {availableEtablissements.length > 0 && (
        <Select 
          value={etablissementId || undefined} 
          onValueChange={setEtablissement}
          disabled={!entrepriseId}
        >
          <SelectTrigger className="w-[180px] bg-background">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Select location" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {availableEtablissements.map((etablissement) => (
              <SelectItem key={etablissement.id} value={etablissement.id}>
                {etablissement.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
