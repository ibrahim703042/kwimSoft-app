import { Badge } from "@kwim/shared-ui/ui";

type StatusBadgeProps = Readonly<{ status: string }>;

function getBadgeVariant(status: string): "default" | "secondary" | "outline" {
  if (status === "Supported") return "default";
  if (status === "Experimental" || status === "Preview") return "secondary";
  return "outline";
}

function getBadgeClassName(status: string): string | undefined {
  if (status === "Supported") {
    return "bg-emerald-600/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/30";
  }
  if (status === "Deprecated") {
    return "text-amber-600 dark:text-amber-400 border-amber-500/50";
  }
  return undefined;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge variant={getBadgeVariant(status)} className={getBadgeClassName(status)}>
      {status}
    </Badge>
  );
}
