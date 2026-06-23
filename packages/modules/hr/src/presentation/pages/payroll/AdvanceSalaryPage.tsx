/**
 * AdvanceSalaryPage - Advance salary requests and approvals
 */
import { useState } from "react";
import { Plus, Banknote } from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Label,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@kwim/shared-ui";
import { useQuery } from "@tanstack/react-query";
import { employeeApi } from "../../../application/hr.api";

export default function AdvanceSalaryPage() {
  const [open, setOpen] = useState(false);

  const { data: empData } = useQuery({
    queryKey: ["employees-lookup"],
    queryFn: async () => (await employeeApi.getAll()).data,
  });
  const employees = empData?.data || [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Banknote className="h-5 w-5" />
            Avances sur salaire
          </h2>
          <p className="text-sm text-muted-foreground">
            Demandes d'avance sur salaire et suivi des remboursements
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90" size="sm">
              <Plus className="h-4 w-4 mr-2" /> Nouvelle demande
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Nouvelle demande d'avance</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label>EmployÃ©</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="SÃ©lectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((e: any) => (
                      <SelectItem key={e._id} value={e._id}>
                        {e.firstName} {e.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Montant demandÃ©</Label>
                <Input type="number" placeholder="0" />
              </div>
              <div>
                <Label>Motif</Label>
                <Input placeholder="Optionnel" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
              <Button>Soumettre</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <p className="text-sm text-muted-foreground text-center py-8">
          Aucune demande d'avance. Les demandes apparaÃ®tront ici aprÃ¨s configuration de l'API avances.
        </p>
      </div>
    </div>
  );
}


