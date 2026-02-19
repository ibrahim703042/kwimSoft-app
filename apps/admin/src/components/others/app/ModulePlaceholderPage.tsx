import { useNavigate } from "react-router-dom";
import { Construction } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ModulePlaceholderPageProps {
  title?: string;
  message?: string;
  moduleName?: string;
}

/**
 * Placeholder page for module routes that are not yet implemented.
 * Use for sidebar links that should redirect to a "coming soon" page at localhost:3000.
 */
export default function ModulePlaceholderPage({
  title = "Page en construction",
  message = "Cette section sera bientôt disponible.",
  moduleName,
}: ModulePlaceholderPageProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="rounded-full bg-muted p-6 mb-4">
        <Construction className="h-16 w-16 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-2">{title}</h2>
      {moduleName && (
        <p className="text-sm text-muted-foreground mb-2">Module: {moduleName}</p>
      )}
      <p className="text-muted-foreground text-center max-w-md mb-6">{message}</p>
      <Button variant="outline" onClick={() => navigate("/")}>
        Retour à l'accueil
      </Button>
    </div>
  );
}
