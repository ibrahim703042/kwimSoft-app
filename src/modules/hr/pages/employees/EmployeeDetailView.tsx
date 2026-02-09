/**
 * EmployeeDetailView — View employee with tabs for all related data
 *
 * Tabs: Informations | Contrats | Congés | Présences | Paie
 */
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  User,
  FileText,
  CalendarOff,
  Clock,
  Wallet,
  LucideIcon,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  contractApi,
  leaveApi,
  attendanceApi,
  payrollApi,
} from "../../api/hr.api";

const STATUS_LABELS: Record<string, string> = {
  active: "Actif",
  inactive: "Inactif",
  on_leave: "En congé",
  probation: "Période d'essai",
  terminated: "Résilié",
  draft: "Brouillon",
  confirmed: "Confirmé",
  paid: "Payé",
  cancelled: "Annulé",
  pending: "En attente",
  approved: "Approuvé",
  rejected: "Rejeté",
  present: "Présent",
  absent: "Absent",
  late: "En retard",
};

interface EmployeeDetailViewProps {
  employee: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TABS: { key: string; label: string; icon: LucideIcon }[] = [
  { key: "info", label: "Informations", icon: User },
  { key: "contracts", label: "Contrats", icon: FileText },
  { key: "leave", label: "Congés", icon: CalendarOff },
  { key: "attendance", label: "Présences", icon: Clock },
  { key: "payroll", label: "Paie", icon: Wallet },
];

function extractList(res: any): any[] {
  const data = res?.data;
  if (Array.isArray(data)) return data;
  if (data?.data && Array.isArray(data.data)) return data.data;
  return [];
}

export function EmployeeDetailView({
  employee,
  open,
  onOpenChange,
}: EmployeeDetailViewProps) {
  const [activeTab, setActiveTab] = useState(TABS[0].key);
  const employeeId = employee?._id || employee?.id;

  const { data: contractsData } = useQuery({
    queryKey: ["contracts", employeeId],
    queryFn: () => contractApi.getAll(),
    enabled: open && !!employeeId,
  });
  const { data: leaveData } = useQuery({
    queryKey: ["leaves", employeeId],
    queryFn: () => leaveApi.getAll(),
    enabled: open && !!employeeId,
  });
  const { data: attendanceData } = useQuery({
    queryKey: ["attendance", employeeId],
    queryFn: () => attendanceApi.getAll(),
    enabled: open && !!employeeId,
  });
  const { data: payrollData } = useQuery({
    queryKey: ["payroll", employeeId],
    queryFn: () => payrollApi.getAll(),
    enabled: open && !!employeeId,
  });

  const allContracts = extractList(contractsData);
  const allLeaves = extractList(leaveData);
  const allAttendances = extractList(attendanceData);
  const allPayrolls = extractList(payrollData);

  const contracts = allContracts.filter(
    (c: any) => (c.employee?._id || c.employee) === employeeId
  );
  const leaves = allLeaves.filter(
    (l: any) => (l.employee?._id || l.employee) === employeeId
  );
  const attendances = allAttendances.filter(
    (a: any) => (a.employee?._id || a.employee) === employeeId
  );
  const payrolls = allPayrolls.filter(
    (p: any) => (p.employee?._id || p.employee) === employeeId
  );

  if (!employee) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="pr-8">
            {employee.firstName} {employee.lastName}
          </DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="border-b shrink-0">
          <nav className="flex gap-0 overflow-x-auto">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              const badge =
                tab.key === "contracts"
                  ? contracts.length
                  : tab.key === "leave"
                    ? leaves.length
                    : tab.key === "attendance"
                      ? attendances.length
                      : tab.key === "payroll"
                        ? payrolls.length
                        : undefined;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                    isActive
                      ? "border-[#0F123F] text-[#0F123F] bg-muted/30"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon size={16} />
                  {tab.label}
                  {typeof badge === "number" && badge > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs rounded-full bg-primary/10 text-primary">
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab content */}
        <div className="flex-1 min-h-0 overflow-auto py-4">
          {activeTab === "info" && (
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <div>
                <span className="text-muted-foreground">Prénom</span>
                <p className="font-medium">{employee.firstName ?? "—"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Nom</span>
                <p className="font-medium">{employee.lastName ?? "—"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Email</span>
                <p className="font-medium">{employee.email ?? "—"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Téléphone</span>
                <p className="font-medium">{employee.phone ?? "—"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Département</span>
                <p className="font-medium">{employee.department?.name ?? "—"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Poste</span>
                <p className="font-medium">{employee.position?.title ?? "—"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Statut</span>
                <p className="font-medium">
                  {(STATUS_LABELS[employee.status] || employee.status) ?? "—"}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Date d'embauche</span>
                <p className="font-medium">
                  {employee.hireDate
                    ? new Date(employee.hireDate).toLocaleDateString()
                    : "—"}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Genre</span>
                <p className="font-medium">
                  {employee.gender === "male"
                    ? "Masculin"
                    : employee.gender === "female"
                      ? "Féminin"
                      : employee.gender ?? "—"}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Date de naissance</span>
                <p className="font-medium">
                  {employee.birthDate
                    ? new Date(employee.birthDate).toLocaleDateString()
                    : "—"}
                </p>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Adresse</span>
                <p className="font-medium">{employee.address ?? "—"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">N° Carte d'identité</span>
                <p className="font-medium">{employee.nationalId ?? "—"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Contact d'urgence</span>
                <p className="font-medium">{employee.emergencyContact ?? "—"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Tél. urgence</span>
                <p className="font-medium">{employee.emergencyPhone ?? "—"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">ID biométrique</span>
                <p className="font-medium font-mono text-xs">{employee.biometricId ?? "—"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">MAC WiFi</span>
                <p className="font-medium font-mono text-xs">{employee.wifiMac ?? "—"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">ID appareil</span>
                <p className="font-medium font-mono text-xs">{employee.deviceId ?? "—"}</p>
              </div>
            </div>
          )}

          {activeTab === "contracts" && (
            <div className="rounded-md border">
              {contracts.length === 0 ? (
                <p className="text-sm text-muted-foreground p-4 text-center">
                  Aucun contrat
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Référence</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Début</TableHead>
                      <TableHead>Fin</TableHead>
                      <TableHead>Salaire</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contracts.map((c: any) => (
                      <TableRow key={c._id}>
                        <TableCell className="font-medium">
                          {c.reference ?? "—"}
                        </TableCell>
                        <TableCell>{c.type ?? "—"}</TableCell>
                        <TableCell>
                          {c.startDate
                            ? new Date(c.startDate).toLocaleDateString()
                            : "—"}
                        </TableCell>
                        <TableCell>
                          {c.endDate
                            ? new Date(c.endDate).toLocaleDateString()
                            : "—"}
                        </TableCell>
                        <TableCell>
                          {c.salary != null
                            ? `${c.salary} ${c.currency || "CDF"}`
                            : "—"}
                        </TableCell>
                        <TableCell>
                          {STATUS_LABELS[c.status] || c.status}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          )}

          {activeTab === "leave" && (
            <div className="rounded-md border">
              {leaves.length === 0 ? (
                <p className="text-sm text-muted-foreground p-4 text-center">
                  Aucun congé
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Du</TableHead>
                      <TableHead>Au</TableHead>
                      <TableHead>Jours</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaves.map((l: any) => (
                      <TableRow key={l._id}>
                        <TableCell className="font-medium">{l.type ?? "—"}</TableCell>
                        <TableCell>
                          {l.startDate
                            ? new Date(l.startDate).toLocaleDateString()
                            : "—"}
                        </TableCell>
                        <TableCell>
                          {l.endDate
                            ? new Date(l.endDate).toLocaleDateString()
                            : "—"}
                        </TableCell>
                        <TableCell>{l.totalDays ?? "—"}</TableCell>
                        <TableCell>
                          {STATUS_LABELS[l.status] || l.status}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          )}

          {activeTab === "attendance" && (
            <div className="rounded-md border">
              {attendances.length === 0 ? (
                <p className="text-sm text-muted-foreground p-4 text-center">
                  Aucune présence
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Arrivée</TableHead>
                      <TableHead>Départ</TableHead>
                      <TableHead>Heures</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendances.map((a: any) => (
                      <TableRow key={a._id}>
                        <TableCell className="font-medium">
                          {a.date
                            ? new Date(a.date).toLocaleDateString()
                            : "—"}
                        </TableCell>
                        <TableCell>{a.checkInTime ?? "—"}</TableCell>
                        <TableCell>{a.checkOutTime ?? "—"}</TableCell>
                        <TableCell>
                          {a.totalHours != null ? `${a.totalHours}h` : "—"}
                        </TableCell>
                        <TableCell>
                          {STATUS_LABELS[a.status] || a.status}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          )}

          {activeTab === "payroll" && (
            <div className="rounded-md border">
              {payrolls.length === 0 ? (
                <p className="text-sm text-muted-foreground p-4 text-center">
                  Aucune fiche de paie
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Référence</TableHead>
                      <TableHead>Période</TableHead>
                      <TableHead>Brut</TableHead>
                      <TableHead>Net</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payrolls.map((p: any) => (
                      <TableRow key={p._id}>
                        <TableCell className="font-medium">
                          {p.reference ?? "—"}
                        </TableCell>
                        <TableCell>{p.period ?? "—"}</TableCell>
                        <TableCell>
                          {p.grossSalary != null
                            ? `${(p.grossSalary || 0).toLocaleString()} ${p.currency || "CDF"}`
                            : "—"}
                        </TableCell>
                        <TableCell>
                          {p.netSalary != null
                            ? `${(p.netSalary || 0).toLocaleString()} ${p.currency || "CDF"}`
                            : "—"}
                        </TableCell>
                        <TableCell>
                          {STATUS_LABELS[p.status] || p.status}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
