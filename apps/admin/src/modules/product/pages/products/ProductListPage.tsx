/**
 * ProductListPage — Odoo-style product page
 *
 * Orchestrates the product list table and the form dialog.
 * All tab content, schema, columns, and header are in separate files.
 */
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CrudPage, CrudForm, TabbedForm, createEntityApi } from "@/core/crud";
import Swal from "sweetalert2";

import { productSchema, defaultValues, type ProductFormValues } from "./product.schema";
import { productColumns } from "./product.columns";
import { ProductFormHeader } from "./ProductFormHeader";
import { useProductTabs } from "./useProductTabs";

// ─── API ──────────────────────────────────────────────────────
const productApi = createEntityApi("product", "/product");

// ─── Page Component ──────────────────────────────────────────
export default function ProductListPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const qc = useQueryClient();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  useEffect(() => {
    if (editing) {
      form.reset({
        ...defaultValues,
        ...editing,
        attributes: editing.attributes || [],
        suppliers: editing.suppliers || [],
      });
    } else {
      form.reset(defaultValues);
    }
  }, [editing]);

  const mutation = useMutation({
    mutationFn: async (values: ProductFormValues) => {
      if (editing) {
        const id = editing._id || editing.id;
        return productApi.update(id, values);
      }
      return productApi.create(values);
    },
    onSuccess: () => {
      Swal.fire("Succès!", `Produit ${editing ? "modifié" : "créé"} avec succès.`, "success");
      qc.invalidateQueries({ queryKey: ["product"] });
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

  const tabs = useProductTabs(form);

  return (
    <>
      <CrudPage
        config={{
          title: "Produits",
          queryKey: ["product"],
          queryFn: productApi.list,
          columns: productColumns,
          deleteFn: async (id: string) => { await productApi.delete(id); },
          permissions: {
            read: "product.read",
            create: "product.create",
            update: "product.update",
            delete: "product.delete",
          },
        }}
        addButton={
          <Button className="bg-[#0F123F]" size="sm" onClick={() => { setEditing(null); setFormOpen(true); }}>
            <Plus className="h-4 w-4 mr-1" /> Nouveau produit
          </Button>
        }
        onEdit={(row: any) => { setEditing(row); setFormOpen(true); }}
      />

      <CrudForm
        open={formOpen}
        onOpenChange={(open) => { if (!open) closeForm(); else setFormOpen(true); }}
        title={editing ? "Modifier Produit" : "Nouveau Produit"}
        form={form}
        onSubmit={(data) => mutation.mutateAsync(data)}
        isLoading={mutation.isPending}
        submitText={editing ? "Enregistrer" : "Créer"}
        cancelText="Annuler"
        wide
      >
        <ProductFormHeader form={form} />
        <div className="border-t my-2" />
        <TabbedForm form={form} tabs={tabs} />
      </CrudForm>
    </>
  );
}
