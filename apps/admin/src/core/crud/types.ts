import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";

export interface CrudPermissions {
  read?: string;
  create?: string;
  update?: string;
  delete?: string;
}

export interface CrudConfig<T = any> {
  title: string;
  queryKey: string[];
  queryFn: (params: any) => Promise<any>;
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
}

export interface Action {
  id: string;
  label: string;
  onClick: () => void;
  permission?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  icon?: React.ComponentType<any>;
  disabled?: boolean;
  loading?: boolean;
}
