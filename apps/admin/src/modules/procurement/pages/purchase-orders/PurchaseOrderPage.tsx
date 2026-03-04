/**
 * PurchaseOrderPage — Odoo-style Purchase Requisition page
 *
 * Orchestrates the PO list table and the form dialog.
 * All tab content, schema, columns, and header are in separate files.
 * Supports MTO (Make to Order) and auto-purchase from POS.
 */
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CrudPage, CrudForm, TabbedForm, createEntityApi } from "@/core/crud";
import Swal from "sweetalert2";

import { poSchema, poDefaultValues, type POFormValues } from "./po.schema";
import { poColumns } from "./po.columns";
import { POFormHeader } from "./POFormHeader";
import { usePOTabs } from "./usePOTabs";

// ─── API ──────────────────────────────────────────────────────
const poApi = createEntityApi("stock", "/purchase-order");

// ─── Page Component ──────────────────────────────────────────
export default function PurchaseOrderPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const qc = useQueryClient();

  const form = useForm<POFormValues>({
    resolver: zodResolver(poSchema),
    defaultValues: poDefaultValues,
  });

  useEffect(() => {
    if (editing) {
      form.reset({
        ...poDefaultValues,
        ...editing,
        items: editing.items || [],
      });
    } else {
      form.reset(poDefaultValues);
    }
  }, [editing]);

  const mutation = useMutation({
    mutationFn: async (values: POFormValues) => {
      if (editing) {
        const id = editing._id || editing.id;
        return poApi.update(id, values);
      }
      return poApi.create(values);
    },
    onSuccess: () => {
      Swal.fire("Succès!", `Bon de commande ${editing ? "modifié" : "créé"} avec succès.`, "success");
      qc.invalidateQueries({ queryKey: ["purchase-order"] });
      closeForm();
    },
    onError: (err: any) => {
      Swal.fire("Erreur!", err.response?.data?.message || "Une erreur est survenue.", "error");
    },
  });

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
    form.reset(poDefaultValues);
  };

  const tabs = usePOTabs(form);

  return (
    <>
      <CrudPage
        config={{
          title: "Bons de commande",
          queryKey: ["purchase-order"],
          queryFn: poApi.list,
          columns: poColumns,
          deleteFn: async (id: string) => { await poApi.delete(id); },
          permissions: {
            read: "purchase_order.read",
            create: "purchase_order.create",
            update: "purchase_order.update",
            delete: "purchase_order.delete",
          },
        }}
        addButton={
          <Button className="bg-[#0F123F]" size="sm" onClick={() => { setEditing(null); setFormOpen(true); }}>
            <Plus className="h-4 w-4 mr-1" /> Nouveau BC
          </Button>
        }
        onEdit={(row: any) => { setEditing(row); setFormOpen(true); }}
      />

      <CrudForm
        open={formOpen}
        onOpenChange={(open) => { if (!open) closeForm(); else setFormOpen(true); }}
        title={editing ? "Modifier Bon de commande" : "Nouveau Bon de commande"}
        form={form}
        onSubmit={(data) => mutation.mutateAsync(data)}
        isLoading={mutation.isPending}
        submitText={editing ? "Enregistrer" : "Créer"}
        cancelText="Annuler"
        wide
      >
        <POFormHeader form={form} />
        <div className="border-t my-2" />
        <TabbedForm form={form} tabs={tabs} />
      </CrudForm>
    </>
  );
}
