import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CrudTable } from "./CrudTable";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@kwim/shared-ui";
import { Plus, AlertCircle, RefreshCw, Filter, Search } from "lucide-react";
import { CrudConfig } from "./types";
import Swal from "sweetalert2";
import { useDebounce } from "../hooks";
import { cn } from "../lib/utils";

type CrudPageProps<T> = {
  config: CrudConfig<T>;
  addButton?: React.ReactNode;
  onEdit?: (row: T) => void;
  onView?: (row: T) => void;
  children?: React.ReactNode;
  canCreate?: boolean;
};

/**
 * Generic CRUD page component.
 * Layout: PageHeader (title + icon + description + actions) → Filter card (search + optional selects) → Table in card.
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
  const [filtersVisible, setFiltersVisible] = useState(false);

  // Filter dropdown state (key -> value)
  const initialFilterValues: Record<string, string> = {};
  (config.filterSelects ?? []).forEach((s) => {
    initialFilterValues[s.key] = "";
  });
  const [filterValues, setFilterValues] = useState<Record<string, string>>(initialFilterValues);
  const debouncedFilterValues = useDebounce(filterValues, 300);

  const queryClient = useQueryClient();

  const { data: responseData, isLoading, error, refetch } = useQuery({
    queryKey: [...config.queryKey, debouncedSearch, debouncedFilterValues],
    queryFn: () =>
      config.queryFn({
        search: debouncedSearch,
        filters: config.filterSelects?.length ? debouncedFilterValues : undefined,
      }),
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

  const showFilterCard =
    config.enableSearch !== false || (config.filterSelects?.length ?? 0) > 0;
  const HeaderIcon = config.headerIcon;

  return (
    <div className="space-y-6 min-w-0">
      {/* PageHeader — same design as HR: title with icon, description, actions */}
      <div className="flex justify-between items-start sm:items-center gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            {HeaderIcon && <HeaderIcon className="h-5 w-5 text-primary" />}
            {config.title}
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage {config.title.toLowerCase()}
          </p>
        </div>
        {canCreate && (
          <div className="flex-shrink-0">
            {addButton || (
              <Button size="sm" className="shadow-sm">
                <Plus className="h-4 w-4 mr-2" />
                Add {config.title.slice(0, -1)}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Filter card — PageFilters-style: card title + count, filter toggle, search + selects when expanded */}
      {showFilterCard && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 bg-white dark:bg-gray-800 p-4 rounded-xl py-5 gap-y-2 border">
          <div className="lg:col-span-6 sm:col-span-2 flex flex-col justify-center">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-8 space-y-1 sm:space-y-0">
              <p className="font-medium text-muted-foreground dark:text-[#191c21c8] text-[0.95rem]">
                {config.filterCardTitle ?? "Data"}
                <span className="text-[0.7rem] font-normal ml-1">({data.length})</span>
              </p>
            </div>
          </div>
          <div className="lg:col-span-6 flex items-center justify-end sm:justify-start lg:justify-end">
            <button
              type="button"
              onClick={() => setFiltersVisible((prev) => !prev)}
              className="bg-primary/20 dark:bg-[#707eae3a] rounded-full h-9 w-9 flex justify-center items-center hover:bg-primary/30 dark:hover:bg-[#707eae50] transition-colors"
              aria-label={filtersVisible ? "Hide filters" : "Show filters"}
            >
              <Filter className="h-4 w-4 text-primary dark:text-[#707eae]" />
            </button>
          </div>
          {filtersVisible && (
            <div className="lg:col-span-12 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-border/50 mt-2">
              {config.enableSearch !== false && (
                <div className="relative flex-1 min-w-0 max-w-full sm:max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    placeholder={config.searchPlaceholder ?? "Search..."}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
              )}
              {(config.filterSelects ?? []).map((sel) => (
                <Select
                  key={sel.key}
                  value={filterValues[sel.key] ?? ""}
                  onValueChange={(v) =>
                    setFilterValues((prev) => ({ ...prev, [sel.key]: v }))
                  }
                >
                  <SelectTrigger className="w-full sm:w-auto sm:min-w-[140px]">
                    <SelectValue placeholder={sel.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {sel.options.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Table card — inner content is CrudTable (or custom children) */}
      <div className={cn("rounded-lg border min-w-0 overflow-hidden", "bg-white dark:bg-gray-800")}>
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
              {(error as any)?.response?.data?.message ||
                (error as any)?.message ||
                "Veuillez réessayer."}
            </p>
            <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-2">
              <RefreshCw className="h-4 w-4 mr-2" />
              Réessayer
            </Button>
          </div>
        ) : (
          children ?? (
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
          )
        )}
      </div>

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
    </div>
  );
}
