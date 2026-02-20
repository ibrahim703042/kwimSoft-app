import { Badge } from "@/components/ui/badge";

export function StatusBadge({ status }: { status: string }) {
  const variant =
    status === "Supported"
      ? "default"
      : status === "Experimental"
        ? "secondary"
        : status === "Preview"
          ? "secondary"
          : "outline";
  const className =
    status === "Supported"
      ? "bg-emerald-600/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
      : status === "Deprecated"
        ? "text-amber-600 dark:text-amber-400 border-amber-500/50"
        : undefined;
  return (
    <Badge variant={variant} className={className}>
      {status}
    </Badge>
  );
}
