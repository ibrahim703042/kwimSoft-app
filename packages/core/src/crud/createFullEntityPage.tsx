import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus } from "lucide-react";
import { Button } from "@kwim/shared-ui";
import { CrudPage } from "./CrudPage";
import { CrudForm } from "./CrudForm";
import { DynamicFormFields } from "./DynamicFormFields";
import { createEntityApi, ServiceName } from "./createModule";
import type { FieldConfig, CrudConfig } from "./types";
import Swal from "sweetalert2";

export interface FullEntityPageConfig {
  key: string;
  title: string;
  singular: string;
  endpoint: string;
  service: ServiceName;
  permissionPrefix?: string;
  columns: any[];
  formFields: FieldConfig[];
  formSchema: z.ZodSchema;
  defaultValues: Record<string, any>;
  wide?: boolean;
}

export function createFullEntityPage(config: FullEntityPageConfig) {
  return function EntityPage() {
    const [formOpen, setFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const queryClient = useQueryClient();

    const api = createEntityApi(config.service, config.endpoint);

    const form = useForm({
      resolver: zodResolver(config.formSchema),
      defaultValues: config.defaultValues,
    });

    useQuery({
      queryKey: [config.key],
      queryFn: () => api.list(),
    });

    const createMutation = useMutation({
      mutationFn: (values: any) => api.create(values),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [config.key] });
        setFormOpen(false);
        form.reset(config.defaultValues);
        Swal.fire({
          title: "Succès!",
          text: `${config.singular} créé avec succès.`,
          icon: "success",
          confirmButtonText: "OK",
        });
      },
      onError: (error: any) => {
        Swal.fire({
          title: "Erreur!",
          text: error.message || "Une erreur est survenue.",
          icon: "error",
          confirmButtonText: "OK",
        });
      },
    });

    const updateMutation = useMutation({
      mutationFn: (values: any) => {
        const id = editingItem?._id || editingItem?.id;
        return api.update(id, values);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [config.key] });
        setFormOpen(false);
        setEditingItem(null);
        form.reset(config.defaultValues);
        Swal.fire({
          title: "Succès!",
          text: `${config.singular} mis à jour avec succès.`,
          icon: "success",
          confirmButtonText: "OK",
        });
      },
      onError: (error: any) => {
        Swal.fire({
          title: "Erreur!",
          text: error.message || "Une erreur est survenue.",
          icon: "error",
          confirmButtonText: "OK",
        });
      },
    });

    const deleteMutation = useMutation({
      mutationFn: (id: string) => api.delete(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [config.key] });
        Swal.fire({
          title: "Succès!",
          text: `${config.singular} supprimé avec succès.`,
          icon: "success",
          confirmButtonText: "OK",
        });
      },
      onError: (error: any) => {
        Swal.fire({
          title: "Erreur!",
          text: error.message || "Une erreur est survenue.",
          icon: "error",
          confirmButtonText: "OK",
        });
      },
    });

    const handleOpenCreate = () => {
      setEditingItem(null);
      form.reset(config.defaultValues);
      setFormOpen(true);
    };

    const handleEdit = (row: any) => {
      setEditingItem(row);
      form.reset(row);
      setFormOpen(true);
    };

    const crudConfig: CrudConfig<any> = {
      title: config.title,
      queryKey: [config.key],
      queryFn: () => api.list(),
      columns: config.columns,
      deleteFn: async (id: string) => {
        await api.delete(id);
      },
      permissions: config.permissionPrefix
        ? {
            create: `${config.permissionPrefix}:create`,
            read: `${config.permissionPrefix}:read`,
            update: `${config.permissionPrefix}:update`,
            delete: `${config.permissionPrefix}:delete`,
          }
        : undefined,
    };

    return (
      <>
        <CrudPage
          config={crudConfig}
          onEdit={handleEdit}
          addButton={
            <Button size="sm" onClick={handleOpenCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter {config.singular}
            </Button>
          }
        />

        <CrudForm
          open={formOpen}
          onOpenChange={setFormOpen}
          title={editingItem ? `Modifier ${config.singular}` : `Créer ${config.singular}`}
          form={form}
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending || updateMutation.isPending}
          submitText={editingItem ? "Mettre à jour" : "Créer"}
          cancelText="Annuler"
          wide={config.wide}
          expandable
        >
          <DynamicFormFields form={form} fields={config.formFields} columns={2} />
        </CrudForm>
      </>
    );

    function handleSubmit(values: any) {
      if (editingItem) {
        updateMutation.mutate(values);
      } else {
        createMutation.mutate(values);
      }
    }
  };
}
