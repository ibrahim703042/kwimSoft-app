import {
  LayoutDashboard, Contact, Target, Lightbulb, Megaphone, CalendarCheck,
} from "lucide-react";
import { ModuleShell, ShellNavItem } from "@kwim/shared-ui";

import {
  CrmDashboard,
  ContactPage,
  LeadPage,
  OpportunityPage,
  CampaignPage,
  ActivityPage,
} from "./pages";

const items: ShellNavItem[] = [
  { key: "dashboard",     label: "Tableau de bord", icon: LayoutDashboard, component: CrmDashboard },
  { key: "contacts",      label: "Contacts",        icon: Contact,        component: ContactPage },
  { key: "leads",         label: "Prospects",        icon: Target,         component: LeadPage },
  { key: "opportunities", label: "Opportunités",     icon: Lightbulb,      component: OpportunityPage },
  { key: "campaigns",     label: "Campagnes",        icon: Megaphone,      component: CampaignPage },
  { key: "activities",    label: "Activités",        icon: CalendarCheck,  component: ActivityPage },
];

export default function CrmShell({ breadcrumbPath = "/crm" }: { breadcrumbPath?: string }) {
  return (
    <ModuleShell
      title="CRM"
      breadcrumbPath={breadcrumbPath}
      items={items}
      enableSearch
    />
  );
}
