import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { IamPermissionModule } from "@/pages/iam/types";

interface PermissionsMatrixProps {
  modules: IamPermissionModule[];
  selectedModuleId: string;
  onModuleChange: (moduleId: string) => void;
  checked: Record<string, boolean>;
  onCheckedChange: (permissionId: string, value: boolean) => void;
  onSave?: () => void;
  onTerminateSessions?: () => void;
  showActions?: boolean;
}

export default function PermissionsMatrix({
  modules,
  selectedModuleId,
  onModuleChange,
  checked,
  onCheckedChange,
  onSave,
  onTerminateSessions,
  showActions = true,
}: Readonly<PermissionsMatrixProps>) {
  const module = modules.find((m) => m.id === selectedModuleId) ?? modules[0];

  return (
    <div className="space-y-4">
      {showActions && (onSave || onTerminateSessions) && (
        <div className="flex flex-wrap justify-end gap-2">
          {onTerminateSessions && (
            <Button type="button" variant="destructive" onClick={onTerminateSessions}>
              Terminate all sessions
            </Button>
          )}
          {onSave && (
            <Button type="button" onClick={onSave}>
              Save changes
            </Button>
          )}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-12">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-base">Modules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {modules.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => onModuleChange(m.id)}
                className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                  selectedModuleId === m.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                {m.name}
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-8">
          <CardHeader>
            <CardTitle className="text-base">{module.name} permissions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {module.permissions.map((perm) => (
              <div
                key={perm.id}
                className="flex items-start gap-3 rounded-lg border p-3"
              >
                <Checkbox
                  checked={checked[perm.id] ?? false}
                  onCheckedChange={(v) => onCheckedChange(perm.id, Boolean(v))}
                  aria-label={perm.label}
                />
                <div>
                  <p className="text-sm font-medium">{perm.label}</p>
                  <p className="text-xs text-muted-foreground">{perm.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
