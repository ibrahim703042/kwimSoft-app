/**
 * createFullEntityPage — Factory for fully-featured entity pages
 *
 * Combines CrudPage + CrudForm + DynamicFormFields into a single
 * config-driven page with zero boilerplate. Each entity just provides:
 *  - columns (for table)
 *  - formFields (for create/edit dialog)
 *  - formSchema (zod validation)
 *  - API endpoint / service config
 *
 * Usage:
 *   const WarehousePage = createFullEntityPage({ ...config });
 */
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CrudPage } from "./CrudPage";
import { CrudForm } from "./CrudForm";
import { DynamicFormFields, FieldConfig } from "./DynamicFormFields";
import { createEntityApi, ServiceName } from "./createModule";
import Swal from "sweetalert2";

// ─── Config Type ──────────────────────────────────────────────

export interface FullEntityPageConfig<T = any> {
  /** Entity key (e.g. "warehouse") — used for query keys */
  key: string;
  /** Display title (e.g. "Warehouses") */
  title: string;
  /** Singular title (e.g. "Warehouse") — for dialog titles */
  singular?: string;
  /** API endpoint (e.g. "/warehouse") */
  endpoint: string;
  /** Backend service name */
  service: ServiceName;
  /** Permission prefix (e.g. "warehouse") */
  permissionPrefix: string;
  /** Table columns */
  columns: ColumnDef<T>[];
  /** Form field config for create/edit dialog */
  formFields: FieldConfig[];
  /** Zod validation schema for the form */
  formSchema: z.ZodSchema;
  /** Default form values */
  defaultValues?: Record<string, any>;
  /** Custom transform before sending to API */
  transformBeforeSubmit?: (data: any) => any;
  /** Custom transform when loading data for edit */
  transformForEdit?: (data: any) => any;
}

// ─── Factory ──────────────────────────────────────────────────

export function createFullEntityPage<T extends { _id?: string; id?: string }>(
  config: FullEntityPageConfig<T>
) {
  const api = createEntityApi(config.service, config.endpoint);
  const singular = config.singular || config.title.replace(/s$/i, "");

  return function FullEntityPage() {
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState<T | null>(null);
    const qc = useQueryClient();

    const form = useForm({
      resolver: zodResolver(config.formSchema),
      defaultValues: config.defaultValues || {},
    });

    // Reset form when editing changes
    useEffect(() => {
      if (editing) {
        const data = config.transformForEdit
          ? config.transformForEdit(editing)
          : editing;
        form.reset(data);
      } else {
        form.reset(config.defaultValues || {});
      }
    }, [editing]);

    // Create / Update mutation
    const mutation = useMutation({
      mutationFn: async (values: any) => {
        const payload = config.transformBeforeSubmit
          ? config.transformBeforeSubmit(values)
          : values;
        if (editing) {
          const id = (editing as any)._id || (editing as any).id;
          return api.update(id, payload);
        }
        return api.create(payload);
      },
      onSuccess: () => {
        Swal.fire(
          "Succès!",
          `${singular} ${editing ? "modifié" : "créé"} avec succès.`,
          "success"
        );
        qc.invalidateQueries({ queryKey: [config.key] });
        closeForm();
      },
      onError: (err: any) => {
        Swal.fire(
          "Erreur!",
          err.response?.data?.message || "Une erreur est survenue.",
          "error"
        );
      },
    });

    const closeForm = () => {
      setFormOpen(false);
      setEditing(null);
      form.reset(config.defaultValues || {});
    };

    const handleEdit = (row: T) => {
      setEditing(row);
      setFormOpen(true);
    };

    const handleAdd = () => {
      setEditing(null);
      setFormOpen(true);
    };

    return (
      <>
        <CrudPage<T>
          config={{
            title: config.title,
            queryKey: [config.key],
            queryFn: api.list,
            columns: config.columns,
            deleteFn: async (id: string) => {
              await api.delete(id);
            },
            permissions: {
              read: `${config.permissionPrefix}.read`,
              create: `${config.permissionPrefix}.create`,
              update: `${config.permissionPrefix}.update`,
              delete: `${config.permissionPrefix}.delete`,
            },
          }}
          addButton={
            <Button
              className="bg-[#0F123F]"
              size="sm"
              onClick={handleAdd}
            >
              <Plus className="h-4 w-4 mr-1" />
              Ajouter
            </Button>
          }
          onEdit={handleEdit}
        />

        {/* Create / Edit Dialog */}
        <CrudForm
          open={formOpen}
          onOpenChange={(open) => {
            if (!open) closeForm();
            else setFormOpen(true);
          }}
          title={editing ? `Modifier ${singular}` : `Nouveau ${singular}`}
          description={
            editing
              ? `Modifier les informations de ce ${singular.toLowerCase()}.`
              : `Remplissez les informations pour créer un nouveau ${singular.toLowerCase()}.`
          }
          form={form}
          onSubmit={(data) => mutation.mutateAsync(data)}
          isLoading={mutation.isPending}
          submitText={editing ? "Modifier" : "Créer"}
          cancelText="Annuler"
        >
          <DynamicFormFields form={form} fields={config.formFields} />
        </CrudForm>
      </>
    );
  };
}
