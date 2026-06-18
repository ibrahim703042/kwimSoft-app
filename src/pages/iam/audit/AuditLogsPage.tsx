import { useMemo, useState } from "react";
import IamPageHeader from "@/components/iam/IamPageHeader";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EmptyState from "@/components/shared/EmptyState";
import { mockAuditLogs } from "../mock-data";

export default function AuditLogsPage() {
  const [search, setSearch] = useState("");
  const [resultFilter, setResultFilter] = useState("all");

  const filtered = useMemo(() => {
    return mockAuditLogs.filter((log) => {
      const matchesSearch =
        !search ||
        log.user.toLowerCase().includes(search.toLowerCase()) ||
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.target.toLowerCase().includes(search.toLowerCase());
      const matchesResult =
        resultFilter === "all" || log.result === resultFilter;
      return matchesSearch && matchesResult;
    });
  }, [search, resultFilter]);

  return (
    <div>
      <IamPageHeader
        title="Audit logs"
        description="Review security and administrative activity"
      />

      <div className="mb-4 flex flex-wrap gap-3">
        <Input
          placeholder="Search user, action, target…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select value={resultFilter} onValueChange={setResultFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Result" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All results</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="failure">Failure</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border bg-card">
        {filtered.length === 0 ? (
          <EmptyState title="No audit logs match your filters" />
        ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & time</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>IP address</TableHead>
              <TableHead>Result</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.timestamp}</TableCell>
                <TableCell>{log.user}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.target}</TableCell>
                <TableCell>{log.ip}</TableCell>
                <TableCell>
                  <Badge variant={log.result === "success" ? "default" : "destructive"}>
                    {log.result}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        )}
      </div>
    </div>
  );
}
