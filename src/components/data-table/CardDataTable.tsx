import { Send, Upload } from "lucide-react";

interface CardDataTableProps {
  title: string;
  nmbre: number;
}

export default function CardDataTable({ title, nmbre }: Readonly<CardDataTableProps>) {
  return (
    <div className="mb-3">
      <div className="grid grid-cols-1 gap-y-2 rounded-xl border bg-card p-4 py-7 sm:grid-cols-2 lg:grid-cols-12">
        <div className="sm:col-span-2 lg:col-span-6">
          <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-8 sm:space-y-0">
            <p className="font-medium text-foreground">
              {title} <span className="text-xs font-normal text-muted-foreground">({nmbre})</span>
            </p>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Send className="h-4 w-4 -rotate-45" aria-hidden="true" />
              <p className="text-sm">Data</p>
            </div>
          </div>
          <div className="mt-5 flex flex-col items-start space-y-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:space-x-5 sm:space-y-0">
            <p className="whitespace-nowrap">Total | {nmbre}</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-4 sm:col-span-1 lg:col-span-6">
          <div className="mx-1 flex h-8 w-8 items-center justify-center rounded-full bg-muted">
            <Upload className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
}
