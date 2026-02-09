import { Construction } from "lucide-react";

interface ComingSoonProps {
  /** Feature / module name */
  title?: string;
  /** Description of what's coming */
  description?: string;
}

/**
 * Placeholder component for features that are not yet implemented.
 * Use as a tab component inside ModuleShell.
 */
export default function ComingSoon({
  title = "En cours de développement",
  description = "Cette fonctionnalité sera bientôt disponible.",
}: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] text-center gap-3 px-4">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
        <Construction className="h-8 w-8 text-primary" />
      </div>
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="text-sm text-muted-foreground max-w-md">{description}</p>
    </div>
  );
}
