import { useState } from "react";
import IamPageHeader from "@/components/iam/IamPageHeader";
import PermissionsMatrix from "@/components/iam/PermissionsMatrix";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { permissionModules } from "../mock-data";
import { notifySuccess } from "@/lib/notify";
import { useGroups } from "@/domains/identity/hooks";
import { useUserData } from "@/hooks/useUserData";
import LoadingState from "@/components/shared/LoadingState";

export default function PermissionsPage() {
  const { data: profile } = useUserData();
  const companyGroupId = profile?.companyId?.keycloakGroupId as string | undefined;
  const { data: groupsData, isLoading } = useGroups(companyGroupId);

  const groups = groupsData?.data ?? [];
  const [selectedFunction, setSelectedFunction] = useState<string>("");
  const [selectedModule, setSelectedModule] = useState(permissionModules[0].id);
  const [checked, setChecked] = useState<Record<string, boolean>>({
    GRADE_VIEW: true,
    ATT_VIEW: true,
  });

  const activeFunction = selectedFunction || groups[0]?.id || "";

  return (
    <div>
      <IamPageHeader
        title="Permissions"
        description="Configure role-based access by function and module"
      />

      <div className="mb-4 max-w-sm">
        <Label className="mb-2 block">Function</Label>
        {isLoading ? (
          <LoadingState />
        ) : (
          <Select
            value={activeFunction}
            onValueChange={setSelectedFunction}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select function" />
            </SelectTrigger>
            <SelectContent>
              {groups.map((g: { id: string; name: string }) => (
                <SelectItem key={g.id} value={g.id}>
                  {g.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <PermissionsMatrix
        modules={permissionModules}
        selectedModuleId={selectedModule}
        onModuleChange={setSelectedModule}
        checked={checked}
        onCheckedChange={(permId, value) =>
          setChecked((prev) => ({ ...prev, [permId]: value }))
        }
        onSave={() => notifySuccess("Permissions saved")}
        onTerminateSessions={() => notifySuccess("All sessions terminated")}
      />
    </div>
  );
}
