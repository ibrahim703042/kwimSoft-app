import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  loading?: boolean;
  label?: string;
  variant?: "spinner" | "skeleton";
  className?: string;
}

export default function LoadingState({
  loading = true,
  label = "Chargement...",
  variant = "spinner",
  className,
}: Readonly<LoadingStateProps>) {
  if (!loading) return null;

  if (variant === "skeleton") {
    return (
      <output className={cn("block space-y-2", className)} aria-busy="true">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <span className="sr-only">{label}</span>
      </output>
    );
  }

  return (
    <output
      className={cn("flex items-center justify-center gap-2 py-8", className)}
      aria-busy="true"
      aria-live="polite"
    >
      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      <span className="text-sm text-muted-foreground">{label}</span>
    </output>
  );
}
