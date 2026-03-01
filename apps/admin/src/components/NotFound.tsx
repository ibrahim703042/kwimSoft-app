import { useNavigate } from "react-router-dom";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4 px-4">
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-muted">
        <FileQuestion className="h-10 w-10 text-muted-foreground" />
      </div>

      <div>
        <h1 className="text-2xl font-bold text-foreground">404</h1>
        <p className="text-sm text-muted-foreground mt-1">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
      </div>

      <div className="flex items-center gap-3 mt-2">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour
        </Button>
        <Button size="sm" onClick={() => navigate("/")}>
          <Home className="h-4 w-4 mr-1" />
          Accueil
        </Button>
      </div>
    </div>
  );
}
