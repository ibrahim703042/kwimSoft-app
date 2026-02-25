import {
  LayoutDashboard,
  Contact,
  Target,
  Lightbulb,
  Megaphone,
  CalendarCheck,
} from "lucide-react";
import { BaseMenuItem } from "../types/module";

export const crmMenuItems: BaseMenuItem[] = [
  { key: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { key: "contacts", label: "Contacts", icon: Contact },
  { key: "leads", label: "Prospects", icon: Target },
  { key: "opportunities", label: "Opportunités", icon: Lightbulb },
  { key: "campaigns", label: "Campagnes", icon: Megaphone },
  { key: "activities", label: "Activités", icon: CalendarCheck },
];

export const crmModuleInfo = {
  name: "crm",
  displayName: "CRM",
  title: "CRM",
  breadcrumbPath: "/crm",
};
