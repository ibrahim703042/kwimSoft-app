import { useState } from "react";
import IamPageHeader from "@/components/iam/IamPageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import EmptyState from "@/components/shared/EmptyState";
import { mockSessions } from "../mock-data";
import { notifySuccess } from "@/lib/notify";

export default function SessionsPage() {
  const [terminateId, setTerminateId] = useState<string | null>(null);
  const [sessions, setSessions] = useState(mockSessions);

  const handleTerminate = () => {
    if (terminateId) {
      setSessions((s) => s.filter((x) => x.id !== terminateId));
      notifySuccess("Session terminated");
      setTerminateId(null);
    }
  };

  return (
    <div>
      <IamPageHeader
        title="Sessions"
        description="Monitor and manage active user sessions"
        actions={
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              setSessions([]);
              notifySuccess("All sessions terminated");
            }}
          >
            Terminate all
          </Button>
        }
      />

      <div className="rounded-lg border bg-card">
        {sessions.length === 0 ? (
          <EmptyState title="No active sessions" />
        ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Device</TableHead>
              <TableHead>IP</TableHead>
              <TableHead>Started</TableHead>
              <TableHead>Last activity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{session.user}</p>
                    <p className="text-xs text-muted-foreground">{session.email}</p>
                  </div>
                </TableCell>
                <TableCell>{session.device}</TableCell>
                <TableCell>{session.ip}</TableCell>
                <TableCell>{session.startedAt}</TableCell>
                <TableCell>{session.lastActivity}</TableCell>
                <TableCell>
                  <Badge variant={session.status === "active" ? "default" : "secondary"}>
                    {session.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setTerminateId(session.id)}
                  >
                    Terminate
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(terminateId)}
        onOpenChange={(open) => !open && setTerminateId(null)}
        title="Terminate session"
        description="This will immediately end the selected session."
        confirmLabel="Terminate"
        onConfirm={handleTerminate}
        destructive
      />
    </div>
  );
}
