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
import { employeeApi, payrollApi } from "../../../application/hr.api";

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
      Swal.fire("EnregistrÃ©", "Fiche de paie crÃ©Ã©e.", "success");
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
      Swal.fire("Attention", "SÃ©lectionnez un employÃ©.", "warning");
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
            Salaires employÃ©s
          </h2>
          <p className="text-sm text-muted-foreground">
            Structure salariale et historique par employÃ©
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90" size="sm">
              <Plus className="h-4 w-4 mr-2" /> DÃ©finir salaire
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <form onSubmit={onSubmit}>
              <DialogHeader>
                <DialogTitle>CrÃ©er une fiche de paie</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label>EmployÃ©</Label>
                  <Select
                    value={form.watch("employee")}
                    onValueChange={(v) => form.setValue("employee", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="SÃ©lectionner" />
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
                    <Label>AnnÃ©e</Label>
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
      <div className="rounded-lg border bg-card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
          </div>
        ) : payslips.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Aucune fiche de paie. CrÃ©ez une fiche via le bouton &quot;DÃ©finir salaire&quot;.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium">NÂ° Fiche</th>
                  <th className="text-left p-3 font-medium">EmployÃ©</th>
                  <th className="text-left p-3 font-medium">PÃ©riode</th>
                  <th className="text-right p-3 font-medium">Salaire base</th>
                  <th className="text-left p-3 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody>
                {payslips.map((p: { _id: string; payslipNumber?: string; employee?: { firstName?: string; lastName?: string }; year?: number; month?: number; basicSalary?: number; status?: string }) => (
                  <tr key={p._id} className="border-t">
                    <td className="p-3">{p.payslipNumber ?? "â€”"}</td>
                    <td className="p-3">
                      {p.employee
                        ? `${(p.employee as { firstName?: string; lastName?: string }).firstName ?? ""} ${(p.employee as { lastName?: string }).lastName ?? ""}`.trim()
                        : "â€”"}
                    </td>
                    <td className="p-3">
                      {p.year != null && p.month != null ? `${p.month}/${p.year}` : "â€”"}
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


