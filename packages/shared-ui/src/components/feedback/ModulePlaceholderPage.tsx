import { Construction } from "lucide-react";
import { Card, CardContent } from "../ui/card";

export interface ModulePlaceholderPageProps {
  readonly title: string;
  readonly description?: string;
}

export function ModulePlaceholderPage({ title, description }: ModulePlaceholderPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        {description && <p className="text-muted-foreground mt-2">{description}</p>}
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Construction className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Page en construction</h2>
          <p className="text-muted-foreground max-w-md">
            Cette fonctionnalité sera bientôt disponible.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export function createPlaceholderPage(title: string, description?: string) {
  return function PlaceholderRoute() {
    return <ModulePlaceholderPage title={title} description={description} />;
  };
}
