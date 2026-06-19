interface CardDataTableProps {
  readonly title: string;
  readonly nmbre: number;
}

export default function CardDataTable({ title, nmbre }: CardDataTableProps) {
  return (
    <div className="mb-3">
      <div className="kwim-surface grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 p-4 py-7 gap-y-2">
        <div className="lg:col-span-6 sm:col-span-2">
          <div className="flex flex-col sm:flex-row space-x-0 sm:space-x-8 space-y-3 sm:space-y-0">
            <p className="font-medium text-foreground">
              {title} <span className="text-xs font-normal text-muted-foreground">({nmbre})</span>
            </p>
            <div className="flex items-center gap-2 text-muted-foreground">
              <p className="text-sm">Data</p>
            </div>
          </div>
          <div className="text-sm text-muted-foreground flex flex-col sm:flex-row items-start sm:items-center sm:space-x-5 mt-5 space-y-3 sm:space-y-0">
            <p className="whitespace-nowrap">Total | 305</p>
            <p className="whitespace-nowrap">Stock | 35</p>
            <p className="whitespace-nowrap">En réserve | 17</p>
          </div>
        </div>
        <div className="lg:col-span-6 justify-end sm:col-span-1 flex items-center gap-4">
          <div className="bg-primary/15 rounded-full h-8 w-8 flex justify-center items-center text-primary">
            <span className="text-xs font-medium">↑</span>
          </div>
        </div>
      </div>
    </div>
  );
}
