/**
 * EmployeePage — Product-style with CrudPage + TabbedForm
 *
 * List from CrudPage; create/edit in CrudForm with tabs:
 * Informations générales | Contact | Emploi | Urgence
 */
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CrudPage } from "@/core/crud/CrudPage";
import { CrudForm } from "@/core/crud/CrudForm";
import { TabbedForm } from "@/core/crud/TabbedForm";
import Swal from "sweetalert2";

import { employeeApi, departmentApi, positionApi } from "../../api/hr.api";
import { employeeSchema, defaultValues, type EmployeeFormValues } from "./employee.schema";
import { employeeColumns } from "./employee.columns";
import { useEmployeeTabs } from "./useEmployeeTabs";

export default function EmployeePage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
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

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues,
  });

  useEffect(() => {
    if (editing) {
      form.reset({
        ...defaultValues,
        firstName: editing.firstName || "",
        lastName: editing.lastName || "",
        email: editing.email || "",
        phone: editing.phone || "",
        department: editing.department?._id || "",
        position: editing.position?._id || "",
        hireDate: editing.hireDate ? editing.hireDate.slice(0, 10) : "",
        status: editing.status || "active",
        gender: editing.gender || "",
        birthDate: editing.birthDate ? editing.birthDate.slice(0, 10) : "",
        address: editing.address || "",
        nationalId: editing.nationalId || "",
        emergencyContact: editing.emergencyContact || "",
        emergencyPhone: editing.emergencyPhone || "",
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

  const tabs = useEmployeeTabs({ form, departments, positions });

  return (
    <>
      <CrudPage
        config={{
          title: "Employés",
          queryKey: ["employees"],
          queryFn: async ({ search }: { search?: string }) => {
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
        <div className="border-b my-2" />
        <TabbedForm form={form} tabs={tabs} />
      </CrudForm>
    </>
  );
}
