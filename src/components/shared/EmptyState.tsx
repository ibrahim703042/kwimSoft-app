import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  action?: { label: string; onClick: () => void };
  className?: string;
}

export default function EmptyState({
  title = "Aucune donnée",
  description = "Il n'y a rien à afficher pour le moment.",
  icon: Icon,
  action,
  className,
}: Readonly<EmptyStateProps>) {
  return (
    <output
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed bg-card p-10 text-center",
        className
      )}
    >
      {Icon && <Icon className="h-10 w-10 text-muted-foreground" aria-hidden="true" />}
      <h3 className="text-sm font-medium text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
      {action && (
        <Button type="button" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </output>
  );
}
