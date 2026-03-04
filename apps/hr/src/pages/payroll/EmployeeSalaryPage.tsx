/**
 * EmployeeSalaryPage - Employee salary structure and payslip history
 */
import { useState } from "react";
import { Plus, UserCircle } from "lucide-react";
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
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { employeeApi, payrollApi } from "../../api/hr.api";

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth() + 1;

interface SalaryFormValues {
  employee: string;
  year: number;
  month: number;
  basicSalary: number;
  currency: string;
}

export default function EmployeeSalaryPage() {
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();

  const { data: empData } = useQuery({
    queryKey: ["employees-lookup"],
    queryFn: async () => (await employeeApi.getAll()).data,
  });
  const employees = empData?.data || empData?.content || [];

  const { data: payrollData, isLoading } = useQuery({
    queryKey: ["payroll-list"],
    queryFn: async () => (await payrollApi.getAll({ limit: 50 })).data,
  });
  const payslips = payrollData?.data || payrollData?.content || [];

  const form = useForm<SalaryFormValues>({
    defaultValues: {
      employee: "",
      year: currentYear,
      month: currentMonth,
      basicSalary: 0,
      currency: "CDF",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: SalaryFormValues) =>
      payrollApi.create({
        employee: values.employee,
        year: values.year,
        month: values.month,
        basicSalary: values.basicSalary,
        currency: values.currency,
      }),
    onSuccess: () => {
      Swal.fire("Enregistré", "Fiche de paie créée.", "success");
      qc.invalidateQueries({ queryKey: ["payroll-list"] });
      setOpen(false);
      form.reset();
    },
    onError: (e: unknown & { response?: { data?: { message?: string } } }) => {
      Swal.fire("Erreur", e.response?.data?.message ?? "Impossible d'enregistrer.", "error");
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    if (!values.employee) {
      Swal.fire("Attention", "Sélectionnez un employé.", "warning");
      return;
    }
    mutation.mutate(values);
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <UserCircle className="h-5 w-5" />
            Salaires employés
          </h2>
          <p className="text-sm text-muted-foreground">
            Structure salariale et historique par employé
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90" size="sm">
              <Plus className="h-4 w-4 mr-2" /> Définir salaire
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <form onSubmit={onSubmit}>
              <DialogHeader>
                <DialogTitle>Créer une fiche de paie</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label>Employé</Label>
                  <Select
                    value={form.watch("employee")}
                    onValueChange={(v) => form.setValue("employee", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((e: { _id: string; firstName?: string; lastName?: string }) => (
                        <SelectItem key={e._id} value={e._id}>
                          {e.firstName} {e.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Année</Label>
                    <Input
                      type="number"
                      min={2000}
                      max={2100}
                      {...form.register("year", { valueAsNumber: true })}
                    />
                  </div>
                  <div>
                    <Label>Mois</Label>
                    <Input
                      type="number"
                      min={1}
                      max={12}
                      {...form.register("month", { valueAsNumber: true })}
                    />
                  </div>
                </div>
                <div>
                  <Label>Salaire de base</Label>
                  <Input
                    type="number"
                    min={0}
                    placeholder="0"
                    {...form.register("basicSalary", { valueAsNumber: true })}
                  />
                </div>
                <div>
                  <Label>Devise</Label>
                  <Input {...form.register("currency")} />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-lg border bg-white dark:bg-gray-800 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
          </div>
        ) : payslips.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Aucune fiche de paie. Créez une fiche via le bouton &quot;Définir salaire&quot;.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium">N° Fiche</th>
                  <th className="text-left p-3 font-medium">Employé</th>
                  <th className="text-left p-3 font-medium">Période</th>
                  <th className="text-right p-3 font-medium">Salaire base</th>
                  <th className="text-left p-3 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody>
                {payslips.map((p: { _id: string; payslipNumber?: string; employee?: { firstName?: string; lastName?: string }; year?: number; month?: number; basicSalary?: number; status?: string }) => (
                  <tr key={p._id} className="border-t">
                    <td className="p-3">{p.payslipNumber ?? "—"}</td>
                    <td className="p-3">
                      {p.employee
                        ? `${(p.employee as { firstName?: string; lastName?: string }).firstName ?? ""} ${(p.employee as { lastName?: string }).lastName ?? ""}`.trim()
                        : "—"}
                    </td>
                    <td className="p-3">
                      {p.year != null && p.month != null ? `${p.month}/${p.year}` : "—"}
                    </td>
                    <td className="p-3 text-right">{p.basicSalary?.toLocaleString() ?? "0"}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-xs bg-muted">
                        {p.status ?? "draft"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
