import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Page, PageHeader, PageToolbar, PageContent } from "../ui";
import { CrudTable } from "./CrudTable";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { Button } from "@kwim/shared-ui";
import { Plus, AlertCircle, RefreshCw } from "lucide-react";
import { CrudConfig } from "./types";
import Swal from "sweetalert2";
import { useDebounce } from "../hooks";

interface CrudPageProps<T> {
  config: CrudConfig<T>;
  addButton?: React.ReactNode;
  onEdit?: (row: T) => void;
  onView?: (row: T) => void;
  children?: React.ReactNode;
  canCreate?: boolean;
}

/**
 * Generic CRUD page component
 * Handles list view with search, pagination, and actions
 */
export function CrudPage<T extends { _id?: string; id?: string }>({
  config,
  addButton,
  onEdit,
  onView,
  children,
  canCreate = true,
}: CrudPageProps<T>) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  const queryClient = useQueryClient();

  const { data: responseData, isLoading, error, refetch } = useQuery({
    queryKey: [...config.queryKey, debouncedSearch],
    queryFn: () => config.queryFn({ search: debouncedSearch }),
    staleTime: 5000,
  });

  const data = responseData?.data?.content || responseData?.data || [];
  const _total = responseData?.data?.total || data.length;
  void _total;

  const { mutate: deleteMutate, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => {
      if (!config.deleteFn) {
        throw new Error("Delete function not provided");
      }
      return config.deleteFn(id);
    },
    onSuccess: () => {
      Swal.fire({
        title: "Success!",
        text: "Item deleted successfully.",
        icon: "success",
        confirmButtonText: "OK",
        customClass: { popup: "swal-custom" },
      });
      queryClient.invalidateQueries({ queryKey: config.queryKey });
      setDeleteDialogOpen(false);
      setSelectedItem(null);
    },
    onError: (error: any) => {
      Swal.fire({
        title: "Error!",
        text: error.message || "An error occurred. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    },
  });

  const handleDelete = (row: T) => {
    setSelectedItem(row);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedItem) {
      const id = (selectedItem as any)._id || (selectedItem as any).id;
      if (id) {
        deleteMutate(id);
      }
    }
  };

  return (
    <Page>
      <PageHeader
        title={config.title}
        description={`Manage ${config.title.toLowerCase()}`}
        actions={
          canCreate && (
            addButton || (
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add {config.title.slice(0, -1)}
              </Button>
            )
          )
        }
      />

      {config.enableSearch !== false && (
        <PageToolbar search={search} onSearchChange={setSearch} />
      )}

      <PageContent>
        {error ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
            <AlertCircle className="h-10 w-10 text-destructive" />
            <p className="text-sm font-medium">
              {(error as any)?.response?.status === 404
                ? "Ce service n'est pas encore disponible."
                : (error as any)?.message === "Network Error"
                  ? "Erreur réseau. Vérifiez votre connexion."
                  : "Erreur lors du chargement des données."}
            </p>
            <p className="text-xs max-w-md text-center">
              {(error as any)?.response?.data?.message || (error as any)?.message || "Veuillez réessayer."}
            </p>
            <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-2">
              <RefreshCw className="h-4 w-4 mr-2" />
              Réessayer
            </Button>
          </div>
        ) : children || (
          <CrudTable
            data={data}
            columns={config.columns}
            isLoading={isLoading}
            enablePagination={config.enablePagination !== false}
            pageSize={config.pageSize || 10}
            permissions={config.permissions}
            onEdit={onEdit}
            onDelete={config.deleteFn ? handleDelete : undefined}
            onView={onView}
            customActions={config.customActions}
          />
        )}
      </PageContent>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Confirm Deletion"
        description="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        isLoading={isDeleting}
        variant="destructive"
      />
    </Page>
  );
}
