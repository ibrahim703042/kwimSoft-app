/**
 * PayrollTasksPage - Payroll run tasks (generate payroll, close period, etc.)
 */
import { CheckSquare, Play, Calendar } from "lucide-react";
import { Button } from "@kwim/shared-ui";

export default function PayrollTasksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <CheckSquare className="h-5 w-5" />
          Tâches paie
        </h2>
        <p className="text-sm text-muted-foreground">
          Génération des paies, clôture de période et traitements batch
        </p>
      </div>

      <div className="grid gap-4 max-w-lg">
        <div className="rounded-lg border bg-white dark:bg-gray-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Play className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Calculer la paie du mois</p>
              <p className="text-sm text-muted-foreground">Génère les fiches de paie pour la période sélectionnée</p>
            </div>
          </div>
          <Button size="sm" variant="outline">Lancer</Button>
        </div>
        <div className="rounded-lg border bg-white dark:bg-gray-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded-lg">
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">Clôturer la période</p>
              <p className="text-sm text-muted-foreground">Verrouille la période pour empêcher les modifications</p>
            </div>
          </div>
          <Button size="sm" variant="outline">Clôturer</Button>
        </div>
      </div>
    </div>
  );
}
