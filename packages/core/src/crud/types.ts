import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";

export type CrudPermissions = {
  read?: string;
  create?: string;
  update?: string;
  delete?: string;
}

export type CrudFilterSelectOption = {
  value: string;
  label: string;
}

export type CrudFilterSelect = {
  key: string;
  placeholder: string;
  options: CrudFilterSelectOption[];
}

export type CrudConfig<T = any> = {
  title: string;
  queryKey: string[];
  queryFn: (params: { search?: string; filters?: Record<string, string> }) => Promise<any>;
  columns: ColumnDef<T>[];
  formSchema?: z.ZodSchema;
  createFn?: (data: any) => Promise<T>;
  updateFn?: (id: string, data: any) => Promise<T>;
  deleteFn?: (id: string) => Promise<void>;
  permissions?: CrudPermissions;
  enableSearch?: boolean;
  enablePagination?: boolean;
  pageSize?: number;
  customActions?: (row: T) => React.ReactNode;
  /** Optional icon component (e.g. Users from lucide-react) for the page header */
  headerIcon?: React.ComponentType<any>;
  /** Title for the filter card (e.g. "Data") */
  filterCardTitle?: string;
  /** Optional filter dropdowns shown in the filter card when expanded */
  filterSelects?: CrudFilterSelect[];
  /** Placeholder for the search input in the filter card */
  searchPlaceholder?: string;
}

export type Action = {
  id: string;
  label: string;
  onClick: () => void;
  permission?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  icon?: React.ComponentType<any>;
  disabled?: boolean;
  loading?: boolean;
}
