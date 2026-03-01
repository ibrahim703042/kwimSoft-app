import { ShieldX } from "lucide-react";

/**
 * Shown when the user does not have permission to view a page.
 * Prevents blank white screen on module routes (e.g. /carwash/wash-service).
 */
export default function NoPermissionCard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
      <div className="rounded-full bg-muted p-6 mb-4">
        <ShieldX className="h-16 w-16 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-2">
        Accès non autorisé
      </h2>
      <p className="text-muted-foreground text-center max-w-md">
        Vous n'avez pas les droits nécessaires pour afficher cette page.
        Contactez votre administrateur pour obtenir l'accès.
      </p>
    </div>
  );
}
