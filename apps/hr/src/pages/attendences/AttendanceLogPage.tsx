/**
 * Attendance Log — Filter and view attendance by type (Manual / Biometric-WiFi-QR-IP)
 */
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@kwim/shared-ui";
import { attendanceApi, employeeApi, departmentApi } from "../../api/hr.api";
import { cn } from "@kwim/shared-ui";

function extractList(res: any): any[] {
  const data = res?.data;
  if (Array.isArray(data)) return data;
  if (data?.data && Array.isArray(data.data)) return data.data;
  return [];
}

const ATTENDANCE_TYPE_LABELS: Record<string, string> = {
  manual: "Manuel",
  biometric: "Biométrique",
  wifi: "WiFi",
  qr: "QR Code",
  ip: "IP",
};

const STATUS_LABELS: Record<string, string> = {
  present: "Présent",
  absent: "Absent",
  late: "En retard",
  half_day: "Demi-journée",
  remote: "Télétravail",
};

/** Radix Select forbids value=""; use this for "all" and map to empty in state */
const ALL_VALUE = "__all__";

export default function AttendanceLogPage() {
  const [branch, setBranch] = useState("");
  const [department, setDepartment] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [logTab, setLogTab] = useState<"manual" | "biometric">("biometric");

  const toSelectValue = (v: string) => (v === "" ? ALL_VALUE : v);
  const fromSelectValue = (v: string) => (v === ALL_VALUE ? "" : v);

  const { data: attData, isLoading } = useQuery({
    queryKey: ["attendance-logs"],
    queryFn: () => attendanceApi.getAll(),
  });
  const { data: empData } = useQuery({
    queryKey: ["employees-lookup"],
    queryFn: () => employeeApi.getAll(),
  });
  const { data: deptData } = useQuery({
    queryKey: ["departments-lookup"],
    queryFn: () => departmentApi.getAll(),
  });

  const allLogs = extractList(attData);
  const employees = extractList(empData);
  const departments = extractList(deptData);

  const filteredLogs = useMemo(() => {
    let list = allLogs as any[];
    if (employeeId) {
      list = list.filter((r) => (r.employee?._id || r.employee) === employeeId);
    }
    if (department) {
      list = list.filter(
        (r) =>
          r.employee?.department?._id === department || r.employee?.department === department
      );
    }
    if (logTab === "manual") {
      list = list.filter((r) => !r.attendanceType || r.attendanceType === "manual");
    } else {
      list = list.filter(
        (r) =>
          r.attendanceType && ["biometric", "wifi", "qr", "ip"].includes(r.attendanceType)
      );
    }
    return list;
  }, [allLogs, employeeId, department, logTab]);

  const empName = (r: any) =>
    r.employee?.fullName ||
    (r.employee?.firstName || r.employee?.lastName
      ? `${r.employee?.firstName || ""} ${r.employee?.lastName || ""}`.trim()
      : "—");

  const handleReset = () => {
    setBranch("");
    setDepartment("");
    setEmployeeId("");
  };


  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Journal de présence</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Filtrez et consultez les pointages manuels et les journaux biométriques, WiFi, QR ou IP.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border p-4 shadow-sm">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          Filtrer les pointages
        </h3>
        <div className="flex flex-wrap gap-3 items-end">
          <div className="min-w-[180px]">
            <label className="text-xs text-muted-foreground block mb-1">Agence</label>
            <Select value={toSelectValue(branch)} onValueChange={(v) => setBranch(fromSelectValue(v))}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner agence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_VALUE}>Toutes</SelectItem>
                <SelectItem value="main">Siège</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="min-w-[180px]">
            <label className="text-xs text-muted-foreground block mb-1">Département</label>
            <Select value={toSelectValue(department)} onValueChange={(v) => setDepartment(fromSelectValue(v))}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner département" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_VALUE}>Tous</SelectItem>
                {departments.filter((d: any) => d?._id).map((d: any) => (
                  <SelectItem key={d._id} value={String(d._id)}>
                    {d?.name ?? "—"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="min-w-[200px]">
            <label className="text-xs text-muted-foreground block mb-1">Employé</label>
            <Select value={toSelectValue(employeeId)} onValueChange={(v) => setEmployeeId(fromSelectValue(v))}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner employé" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_VALUE}>Tous</SelectItem>
                {employees.filter((e: any) => e?._id).map((e: any) => (
                  <SelectItem key={e._id} value={String(e._id)}>
                    {e?.firstName} {e?.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button size="sm">Filtrer</Button>
          <Button size="sm" variant="outline" onClick={handleReset}>
            Réinitialiser
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border shadow-sm overflow-hidden">
        <h3 className="px-4 pt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Journal des pointages
        </h3>
        <div className="border-b flex mt-2">
          <button
            type="button"
            onClick={() => setLogTab("manual")}
            className={cn(
              "px-4 py-3 text-sm font-medium",
              logTab === "manual"
                ? "border-b-2 border-primary text-primary bg-muted/30"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Pointages manuels
          </button>
          <button
            type="button"
            onClick={() => setLogTab("biometric")}
            className={cn(
              "px-4 py-3 text-sm font-medium",
              logTab === "biometric"
                ? "border-b-2 border-primary text-primary bg-muted/30"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Journaux biométriques
          </button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-14">N°</TableHead>
                <TableHead>Employé</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Identifiant</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Arrivée</TableHead>
                <TableHead>Départ</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="max-w-[180px]">Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    Chargement...
                  </TableCell>
                </TableRow>
              ) : filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    Aucun enregistrement
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((row: any, index: number) => (
                  <TableRow key={row._id || index}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{empName(row)}</TableCell>
                    <TableCell>
                      {ATTENDANCE_TYPE_LABELS[row.attendanceType] || row.attendanceType || "manuel"}
                    </TableCell>
                    <TableCell className="font-mono text-xs">{row.identifier || "N/A"}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {row.date
                        ? new Date(row.date).toLocaleString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })
                        : "—"}
                    </TableCell>
                    <TableCell>{row.checkInTime || "—"}</TableCell>
                    <TableCell>{row.checkOutTime || "—"}</TableCell>
                    <TableCell>{STATUS_LABELS[row.status] || row.status || "—"}</TableCell>
                    <TableCell className="max-w-[180px] truncate" title={row.notes || ""}>
                      {row.notes || "—"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
