/**
 * Audit log — real events from feature toggles and console actions (localStorage).
 */
import { useState, useEffect } from "react";
import { useAuthStore } from "@/core/auth";
import { ClipboardList, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAuditEvents, clearAuditLog, appendAuditEvent, type AuditEvent } from "../lib/auditLog";

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffSecs = Math.floor(diffMs / 1000);
  if (diffSecs < 60) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} h ago`;
  return d.toLocaleString();
}

export default function AuditLogPage() {
  const { user } = useAuthStore();
  const displayUser = user?.username || user?.email || "unknown";

  const [events, setEvents] = useState<AuditEvent[]>(getAuditEvents);

  useEffect(() => {
    setEvents(getAuditEvents());
  }, []);

  const handleClear = () => {
    clearAuditLog();
    setEvents([]);
    appendAuditEvent({
      user: displayUser,
      action: "Cleared audit log",
      resource: "Audit log",
    });
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <ClipboardList size={18} />
          <span>Real activity log. Events are recorded when you toggle features or open this page.</span>
        </div>
        <Button variant="outline" size="sm" onClick={handleClear}>
          <Trash2 size={14} className="mr-1" />
          Clear log
        </Button>
      </div>
      <div className="bg-white dark:bg-[#1a1f3b] rounded-md shadow-sm border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/20">
              <th className="py-2.5 px-4 text-left font-medium text-muted-foreground">Time</th>
              <th className="py-2.5 px-4 text-left font-medium text-muted-foreground">User</th>
              <th className="py-2.5 px-4 text-left font-medium text-muted-foreground">Action</th>
              <th className="py-2.5 px-4 text-left font-medium text-muted-foreground">Resource</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 px-4 text-center text-muted-foreground">
                  No events yet. Toggle a feature in Global settings or refresh to see entries.
                </td>
              </tr>
            ) : (
              events.map((row) => (
                <tr key={row.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                  <td className="py-2.5 px-4 text-muted-foreground whitespace-nowrap">
                    {formatTime(row.timestamp)}
                  </td>
                  <td className="py-2.5 px-4 font-medium">{row.user}</td>
                  <td className="py-2.5 px-4">{row.action}</td>
                  <td className="py-2.5 px-4">{row.resource}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
