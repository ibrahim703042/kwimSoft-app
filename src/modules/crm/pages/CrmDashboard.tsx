import { ModuleDashboard, DashboardConfig } from "@/core/crud/ModuleDashboard";
import { createEntityApi } from "@/core/crud/createModule";
import { Contact, Target, Lightbulb, Megaphone, CalendarCheck } from "lucide-react";

const crmApi = createEntityApi("hr", "/contact");

const dashboardConfig: DashboardConfig = {
  queryKey: ["crm-dashboard"],
  queryFn: () => crmApi.list(),
  stats: [
    { key: "contacts", label: "Contacts", icon: Contact, color: "#3b82f6", getValue: (d) => d?.totalContacts ?? 0 },
    { key: "leads", label: "Prospects", icon: Target, color: "#10b981", getValue: (d) => d?.totalLeads ?? 0 },
    { key: "opportunities", label: "Opportunités", icon: Lightbulb, color: "#f59e0b", getValue: (d) => d?.totalOpportunities ?? 0 },
    { key: "campaigns", label: "Campagnes", icon: Megaphone, color: "#8b5cf6", getValue: (d) => d?.totalCampaigns ?? 0 },
    { key: "activities", label: "Activités", icon: CalendarCheck, color: "#06b6d4", getValue: (d) => d?.totalActivities ?? 0 },
  ],
  charts: [
    {
      key: "pipeline-by-stage",
      title: "Pipeline par étape",
      type: "bar",
      xAxisKey: "name",
      dataKeys: [{ key: "count", color: "#3b82f6", label: "Prospects" }],
      getData: (d) => d?.pipelineByStage || [],
    },
    {
      key: "opportunities-by-status",
      title: "Opportunités par statut",
      type: "pie",
      dataKeys: [{ key: "value", color: "#f59e0b" }],
      nameKey: "name",
      getData: (d) => d?.opportunitiesByStatus || [],
    },
    {
      key: "activities-trend",
      title: "Tendance des activités",
      type: "line",
      xAxisKey: "date",
      dataKeys: [{ key: "count", color: "#06b6d4", label: "Activités" }],
      span: 2,
      getData: (d) => d?.activitiesTrend || [],
    },
  ],
};

export default function CrmDashboard() {
  return <ModuleDashboard config={dashboardConfig} />;
}
