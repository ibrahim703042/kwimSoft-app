/**
 * Attendance Log â€” Filter and view attendance by type (Manual / Biometric-WiFi-QR-IP)
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
  Label,
  cn,
} from "@kwim/shared-ui";
import { attendanceApi, employeeApi, departmentApi } from "../../../application/hr.api";

function extractList(res: any): any[] {
  const data = res?.data;
  if (Array.isArray(data)) return data;
  if (data?.data && Array.isArray(data.data)) return data.data;
  return [];
}

const ATTENDANCE_TYPE_LABELS: Record<string, string> = {
  manual: "Manuel",
  biometric: "BiomÃ©trique",
  wifi: "WiFi",
  qr: "QR Code",
  ip: "IP",
};

const STATUS_LABELS: Record<string, string> = {
  present: "PrÃ©sent",
  absent: "Absent",
  late: "En retard",
  half_day: "Demi-journÃ©e",
  remote: "TÃ©lÃ©travail",
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
    let list = allLogs;
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
      : "â€”");

  const handleReset = () => {
    setBranch("");
    setDepartment("");
    setEmployeeId("");
  };


  const renderTableRows = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
            Chargement...
          </TableCell>
        </TableRow>
      );
    }

    if (filteredLogs.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
            Aucun enregistrement
          </TableCell>
        </TableRow>
      );
    }

    return filteredLogs.map((row: any, index: number) => (
      <TableRow key={row._id || `attendance-log-${index}`}>
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
            : "â€”"}
        </TableCell>
        <TableCell>{row.checkInTime || "â€”"}</TableCell>
        <TableCell>{row.checkOutTime || "â€”"}</TableCell>
        <TableCell>{STATUS_LABELS[row.status] || row.status || "â€”"}</TableCell>
        <TableCell className="max-w-[180px] truncate" title={row.notes || ""}>
          {row.notes || "â€”"}
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Journal de prÃ©sence</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Filtrez et consultez les pointages manuels et les journaux biomÃ©triques, WiFi, QR ou IP.
        </p>
      </div>

      <div className="bg-card rounded-xl border p-4 shadow-sm">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          Filtrer les pointages
        </h3>
        <div className="flex flex-wrap gap-3 items-end">
          <div className="min-w-[180px]">
            <Label htmlFor="attendance-branch-filter" className="text-xs text-muted-foreground block mb-1">
              Agence
            </Label>
            <Select value={toSelectValue(branch)} onValueChange={(v) => setBranch(fromSelectValue(v))}>
              <SelectTrigger id="attendance-branch-filter">
                <SelectValue placeholder="SÃ©lectionner agence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_VALUE}>Toutes</SelectItem>
                <SelectItem value="main">SiÃ¨ge</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="min-w-[180px]">
            <Label htmlFor="attendance-department-filter" className="text-xs text-muted-foreground block mb-1">
              DÃ©partement
            </Label>
            <Select value={toSelectValue(department)} onValueChange={(v) => setDepartment(fromSelectValue(v))}>
              <SelectTrigger id="attendance-department-filter">
                <SelectValue placeholder="SÃ©lectionner dÃ©partement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_VALUE}>Tous</SelectItem>
                {departments.filter((d: any) => d?._id).map((d: any) => (
                  <SelectItem key={d._id} value={String(d._id)}>
                    {d?.name ?? "â€”"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="min-w-[200px]">
            <Label htmlFor="attendance-employee-filter" className="text-xs text-muted-foreground block mb-1">
              EmployÃ©
            </Label>
            <Select value={toSelectValue(employeeId)} onValueChange={(v) => setEmployeeId(fromSelectValue(v))}>
              <SelectTrigger id="attendance-employee-filter">
                <SelectValue placeholder="SÃ©lectionner employÃ©" />
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
            RÃ©initialiser
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
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
            Journaux biomÃ©triques
          </button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-14">NÂ°</TableHead>
                <TableHead>EmployÃ©</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Identifiant</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>ArrivÃ©e</TableHead>
                <TableHead>DÃ©part</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="max-w-[180px]">Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{renderTableRows()}</TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}


