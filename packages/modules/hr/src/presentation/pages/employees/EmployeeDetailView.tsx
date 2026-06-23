/**
 * EmployeeDetailView â€” Read-only view of employee (from employee.schema fields)
 */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@kwim/shared-ui";

const STATUS_LABELS: Record<string, string> = {
  active: "Actif",
  inactive: "Inactif",
  on_leave: "En congÃ©",
  probation: "PÃ©riode d'essai",
  terminated: "RÃ©siliÃ©",
};

const GENDER_LABELS: Record<string, string> = {
  male: "Masculin",
  female: "FÃ©minin",
  other: "Autre",
};

function Field({ label, value }: { label: string; value?: string | number | null }) {
  const display = value != null && String(value).trim() !== "" ? String(value) : "â€”";
  return (
    <div>
      <span className="text-muted-foreground text-sm block">{label}</span>
      <p className="font-medium text-sm mt-0.5">{display}</p>
    </div>
  );
}

interface EmployeeDetailViewProps {
  employee: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EmployeeDetailView({
  employee,
  open,
  onOpenChange,
}: EmployeeDetailViewProps) {
  if (!employee) return null;

  const emp = employee as any;
  const hireDate = emp.hireDate
    ? new Date(emp.hireDate).toLocaleDateString("fr-FR")
    : "â€”";
  const birthDate = emp.birthDate
    ? new Date(emp.birthDate).toLocaleDateString("fr-FR")
    : "â€”";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {emp.firstName} {emp.lastName}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm mt-4">
          <Field label="Code employÃ©" value={emp.employeeCode} />
          <Field label="PrÃ©nom" value={emp.firstName} />
          <Field label="Nom" value={emp.lastName} />
          <Field label="Email" value={emp.email} />
          <Field label="TÃ©lÃ©phone" value={emp.phone} />
          <Field label="Genre" value={emp.gender ? GENDER_LABELS[emp.gender] ?? emp.gender : undefined} />
          <Field label="Date de naissance" value={birthDate === "â€”" ? undefined : birthDate} />
          <Field label="Situation familiale" value={emp.maritalStatus} />
          <Field label="NÂ° Carte d'identitÃ©" value={emp.nationalId} />
          <div className="col-span-2">
            <Field label="Adresse" value={emp.address} />
          </div>
          <Field label="DÃ©partement" value={emp.department?.name ?? emp.department} />
          <Field label="Poste" value={emp.position?.title ?? emp.position} />
          <Field label="Agence / Branche" value={emp.branch} />
          <Field label="Date d'embauche" value={hireDate === "â€”" ? undefined : hireDate} />
          <Field label="Statut" value={emp.status ? (STATUS_LABELS[emp.status] ?? emp.status) : undefined} />
          <Field label="Type d'emploi" value={emp.employmentType} />
          <Field label="Horaires bureau" value={emp.officeTime} />
          <Field label="Espace de travail" value={emp.workspace} />
          <Field label="CongÃ©s allouÃ©s" value={emp.leaveAllocated} />
          <Field label="Contact d'urgence" value={emp.emergencyContact} />
          <Field label="TÃ©l. urgence" value={emp.emergencyPhone} />
          <Field label="Banque" value={emp.bankName} />
          <Field label="NÂ° compte" value={emp.bankAccountNumber} />
          <Field label="Titulaire" value={emp.accountHolderName} />
          <Field label="Type de compte" value={emp.bankAccountType} />
          <Field label="ID biomÃ©trique" value={emp.biometricId} />
          <Field label="MAC WiFi" value={emp.wifiMac} />
          <Field label="ID appareil" value={emp.deviceId} />
          {emp.description && (
            <div className="col-span-2">
              <Field label="Description" value={emp.description} />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

