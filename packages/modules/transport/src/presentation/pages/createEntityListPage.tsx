import { ColumnDef } from "@tanstack/react-table";
import { CrudPage } from "@kwim/core";

interface EntityListConfig<T extends { _id: string }> {
  title: string;
  queryKey: string;
  listFn: (params?: { search?: string }) => Promise<{ data: unknown[] }>;
  deleteFn: (id: string) => Promise<unknown>;
  columns: ColumnDef<T>[];
  permissionPrefix: string;
}

export function createEntityListPage<T extends { _id: string }>(config: EntityListConfig<T>) {
  return function EntityListPage() {
    return (
      <CrudPage
        config={{
          title: config.title,
          queryKey: [config.queryKey],
          queryFn: async (params) => {
            const result = await config.listFn(params);
            return { data: result.data as T[] };
          },
          columns: config.columns,
          deleteFn: async (id) => {
            await config.deleteFn(id);
          },
          permissions: {
            read: `${config.permissionPrefix}.read`,
            create: `${config.permissionPrefix}.create`,
            update: `${config.permissionPrefix}.update`,
            delete: `${config.permissionPrefix}.delete`,
          },
        }}
      />
    );
  };
}
