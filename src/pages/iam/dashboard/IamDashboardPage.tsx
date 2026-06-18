import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Monitor, ShieldCheck, Lock } from "lucide-react";
import IamPageHeader from "@/components/iam/IamPageHeader";
import { iamDashboardStats, mockAuditLogs } from "../mock-data";
import { Badge } from "@/components/ui/badge";

const statCards = [
  { label: "Total Users", value: iamDashboardStats.totalUsers.toLocaleString(), icon: Users, trend: "+12.2% from last month" },
  { label: "Active Sessions", value: iamDashboardStats.activeSessions.toString(), icon: Monitor, trend: "+4.1% from last month" },
  { label: "MFA Enabled", value: `${iamDashboardStats.mfaEnabledPercent}%`, icon: ShieldCheck, trend: "+2.5% from last month" },
  { label: "Locked Accounts", value: iamDashboardStats.lockedAccounts.toString(), icon: Lock, trend: "-3 since yesterday" },
];

export default function IamDashboardPage() {
  return (
    <div>
      <IamPageHeader
        title="Identity & Security Center"
        description="Overview of users, sessions, and security events"
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Recent Security Events</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockAuditLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between rounded-lg border p-3 text-sm"
            >
              <div>
                <p className="font-medium">{log.action}</p>
                <p className="text-muted-foreground">{log.user} · {log.target}</p>
              </div>
              <Badge variant={log.result === "success" ? "default" : "destructive"}>
                {log.result}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
