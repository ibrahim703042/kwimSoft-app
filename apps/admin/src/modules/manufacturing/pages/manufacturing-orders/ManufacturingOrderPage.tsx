/**
 * ManufacturingOrderPage — Odoo-style Manufacturing Order
 *
 * Orchestrates the MO list table and the form dialog.
 * All tab content, schema, columns, and header are in separate files.
 */
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CrudPage } from "@/core/crud/CrudPage";
import { CrudForm } from "@/core/crud/CrudForm";
import { TabbedForm } from "@/core/crud/TabbedForm";
import { createEntityApi } from "@/core/crud/createModule";
import Swal from "sweetalert2";

import { moSchema, moDefaultValues, type MOFormValues } from "./mo.schema";
import { moColumns } from "./mo.columns";
import { MOFormHeader } from "./MOFormHeader";
import { useMOTabs } from "./useMOTabs";

// ─── API ──────────────────────────────────────────────────────
const moApi = createEntityApi("stock", "/manufacturing-order");

// ─── Page Component ──────────────────────────────────────────
export default function ManufacturingOrderPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const qc = useQueryClient();

  const form = useForm<MOFormValues>({
    resolver: zodResolver(moSchema),
    defaultValues: moDefaultValues,
  });

  useEffect(() => {
    if (editing) {
      form.reset({
        ...moDefaultValues,
        ...editing,
        components: editing.components || [],
        workOrders: editing.workOrders || [],
      });
    } else {
      form.reset(moDefaultValues);
    }
  }, [editing]);

  const mutation = useMutation({
    mutationFn: async (values: MOFormValues) => {
      if (editing) {
        const id = editing._id || editing.id;
        return moApi.update(id, values);
      }
      return moApi.create(values);
    },
    onSuccess: () => {
      Swal.fire("Succès!", `Ordre ${editing ? "modifié" : "créé"} avec succès.`, "success");
      qc.invalidateQueries({ queryKey: ["manufacturing-order"] });
      closeForm();
    },
    onError: (err: any) => {
      Swal.fire("Erreur!", err.response?.data?.message || "Une erreur est survenue.", "error");
    },
  });

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
    form.reset(moDefaultValues);
  };

  const tabs = useMOTabs(form);

  return (
    <>
      <CrudPage
        config={{
          title: "Ordres de fabrication",
          queryKey: ["manufacturing-order"],
          queryFn: moApi.list,
          columns: moColumns,
          deleteFn: async (id: string) => { await moApi.delete(id); },
          permissions: {
            read: "manufacturing_order.read",
            create: "manufacturing_order.create",
            update: "manufacturing_order.update",
            delete: "manufacturing_order.delete",
          },
        }}
        addButton={
          <Button className="bg-[#0F123F]" size="sm" onClick={() => { setEditing(null); setFormOpen(true); }}>
            <Plus className="h-4 w-4 mr-1" /> Nouvel ordre
          </Button>
        }
        onEdit={(row: any) => { setEditing(row); setFormOpen(true); }}
      />

      <CrudForm
        open={formOpen}
        onOpenChange={(open) => { if (!open) closeForm(); else setFormOpen(true); }}
        title={editing ? "Modifier Ordre de fabrication" : "Nouvel Ordre de fabrication"}
        form={form}
        onSubmit={(data) => mutation.mutateAsync(data)}
        isLoading={mutation.isPending}
        submitText={editing ? "Enregistrer" : "Créer"}
        cancelText="Annuler"
        wide
      >
        <MOFormHeader form={form} />
        <div className="border-t my-2" />
        <TabbedForm form={form} tabs={tabs} />
      </CrudForm>
    </>
  );
}
