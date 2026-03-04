/**
 * EmployeePage — List with CrudPage; create/edit in CrudForm + TabbedForm.
 * Form validation and fields from employee.schema.ts; UI from @kwim/core (CrudPage, CrudForm, TabbedForm).
 */
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Users } from "lucide-react";
import { Button, Checkbox, Label, FormField, FormItem, FormControl } from "@kwim/shared-ui";
import { CrudPage, CrudForm, TabbedForm } from "@kwim/core";
import Swal from "sweetalert2";

import { employeeApi, departmentApi, positionApi } from "../../api/hr.api";
import { employeeSchema, defaultValues, type EmployeeFormValues } from "./employee.schema";
import { employeeColumns } from "./employee.columns";
import { useEmployeeTabs } from "./useEmployeeTabs";
import { EmployeeDetailView } from "./EmployeeDetailView";

export default function EmployeePage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [viewing, setViewing] = useState<any>(null);
  const qc = useQueryClient();

  const { data: deptData } = useQuery({
    queryKey: ["departments-lookup"],
    queryFn: async () => (await departmentApi.getAll()).data,
  });
  const departments = deptData?.data || [];

  const { data: posData } = useQuery({
    queryKey: ["positions-lookup"],
    queryFn: async () => (await positionApi.getAll()).data,
  });
  const positions = posData?.data || [];

  const { data: empLookupData } = useQuery({
    queryKey: ["employees-lookup"],
    queryFn: async () => (await employeeApi.getAll()).data,
  });
  const employeesLookup = empLookupData?.data ?? (Array.isArray(empLookupData) ? empLookupData : []);
  const employees = Array.isArray(employeesLookup) ? employeesLookup : [];

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues,
  });

  useEffect(() => {
    if (editing) {
      form.reset({
        ...defaultValues,
        employeeCode: editing.employeeCode || "",
        firstName: editing.firstName || "",
        lastName: editing.lastName || "",
        email: editing.email || "",
        phone: editing.phone || "",
        gender: editing.gender || "",
        birthDate: editing.birthDate ? editing.birthDate.slice(0, 10) : "",
        maritalStatus: editing.maritalStatus || "",
        nationalId: editing.nationalId || "",
        address: editing.address || "",
        description: editing.description || "",
        avatar: editing.avatar || "",
        department: editing.department?._id || "",
        position: editing.position?._id || "",
        branch: editing.branch || "",
        supervisor: editing.supervisor?._id || editing.supervisor || "",
        employmentType: editing.employmentType || "",
        officeTime: editing.officeTime || "",
        workspace: editing.workspace || "",
        attendanceDuringHoliday: editing.attendanceDuringHoliday ?? false,
        hireDate: editing.hireDate ? editing.hireDate.slice(0, 10) : "",
        status: editing.status || "active",
        leaveAllocated: editing.leaveAllocated ?? 0,
        assignedLeaves: editing.assignedLeaves ?? [],
        emergencyContact: editing.emergencyContact || "",
        emergencyPhone: editing.emergencyPhone || "",
        bankName: editing.bankName || "",
        bankAccountNumber: editing.bankAccountNumber || "",
        accountHolderName: editing.accountHolderName || "",
        bankAccountType: editing.bankAccountType || "",
        biometricId: editing.biometricId || "",
        wifiMac: editing.wifiMac || "",
        deviceId: editing.deviceId || "",
        showEntreprise: editing.showEntreprise ?? false,
        showConge: editing.showConge ?? false,
        showBanque: editing.showBanque ?? false,
        showIdentification: editing.showIdentification ?? false,
      });
    } else {
      form.reset(defaultValues);
    }
  }, [editing]);

  const mutation = useMutation({
    mutationFn: async (values: EmployeeFormValues) => {
      if (editing) {
        const id = editing._id || editing.id;
        return employeeApi.update(id, values);
      }
      return employeeApi.create(values);
    },
    onSuccess: () => {
      Swal.fire("Succès!", `Employé ${editing ? "modifié" : "créé"} avec succès.`, "success");
      qc.invalidateQueries({ queryKey: ["employees"] });
      closeForm();
    },
    onError: (err: any) => {
      Swal.fire("Erreur!", err.response?.data?.message || "Une erreur est survenue.", "error");
    },
  });

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
    form.reset(defaultValues);
  };

  const tabs = useEmployeeTabs({
    form,
    departments,
    positions,
    employees,
    currentEmployeeId: editing?._id ?? null,
  });

  return (
    <>
      <CrudPage
        config={{
          title: "Employés",
          queryKey: ["employees"],
          headerIcon: Users,
          filterCardTitle: "Data",
          searchPlaceholder: "Rechercher les employés...",
          queryFn: async ({ search }) => {
            const res = await employeeApi.getAll({ search });
            const list = (res as any).data?.data ?? (res as any).data ?? [];
            return { data: Array.isArray(list) ? list : [] };
          },
          columns: employeeColumns,
          deleteFn: async (id: string) => {
            await employeeApi.delete(id);
          },
          permissions: {
            read: "employee.read",
            create: "employee.create",
            update: "employee.update",
            delete: "employee.delete",
          },
        }}
        addButton={
          <Button
            className="bg-[#0F123F]"
            size="sm"
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-1" /> Nouveau
          </Button>
        }
        onEdit={(row: any) => {
          setEditing(row);
          setFormOpen(true);
        }}
        onView={(row: any) => setViewing(row)}
      />

      <CrudForm
        open={formOpen}
        onOpenChange={(open) => {
          if (!open) closeForm();
          else setFormOpen(true);
        }}
        title={editing ? "Modifier l'employé" : "Nouvel employé"}
        form={form}
        onSubmit={(data) => mutation.mutateAsync(data)}
        isLoading={mutation.isPending}
        submitText={editing ? "Enregistrer" : "Créer"}
        cancelText="Annuler"
        wide
      >
        <div className="flex flex-wrap items-center gap-4 pb-3 border-b">
          <span className="text-sm font-medium text-muted-foreground">Sections:</span>
          <FormField
            control={form.control}
            name="showEntreprise"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value ?? false} onCheckedChange={field.onChange} />
                </FormControl>
                <Label className="font-normal text-sm cursor-pointer">Détail entreprise</Label>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="showConge"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value ?? false} onCheckedChange={field.onChange} />
                </FormControl>
                <Label className="font-normal text-sm cursor-pointer">Congés</Label>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="showBanque"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value ?? false} onCheckedChange={field.onChange} />
                </FormControl>
                <Label className="font-normal text-sm cursor-pointer">Banque</Label>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="showIdentification"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value ?? false} onCheckedChange={field.onChange} />
                </FormControl>
                <Label className="font-normal text-sm cursor-pointer">Identification / Suivi</Label>
              </FormItem>
            )}
          />
        </div>
        <TabbedForm form={form} tabs={tabs} />
      </CrudForm>

      <EmployeeDetailView
        employee={viewing}
        open={!!viewing}
        onOpenChange={(open: boolean) => !open && setViewing(null)}
      />
    </>
  );
}
