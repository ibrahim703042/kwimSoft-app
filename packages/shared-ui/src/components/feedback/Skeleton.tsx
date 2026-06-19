import { cn } from "../../lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className, ...props }: Readonly<SkeletonProps>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      aria-busy="true"
      aria-hidden="true"
      {...props}
    />
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: Readonly<{ rows?: number; cols?: number }>) {
  return (
    <div className="space-y-3 p-4" role="status" aria-live="polite" aria-label="Chargement">
      {Array.from({ length: rows }, (_, row) => (
        <div key={`skeleton-row-${row}`} className="flex gap-3">
          {Array.from({ length: cols }, (_, col) => (
            <Skeleton key={`skeleton-col-${row}-${col}`} className="h-8 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
