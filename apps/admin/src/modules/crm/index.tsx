/**
 * CRM Module
 *
 * Entities:
 * - Contacts, Leads, Opportunities, Campaigns, Activities
 */
import { FrontModule, AppRoute, MenuItem } from "@/app/ModuleRegistry";
import { Contact } from "lucide-react";
import PageTitle from "@/components/utilitie/PageTitle";
import CrmShell from "./CrmShell";

export const crmModule: FrontModule = {
  name: "crm",
  routes: [
    {
      path: "/crm",
      element: (
        <>
          <PageTitle title="CRM" />
          <CrmShell />
        </>
      ),
      permission: "contact.read",
    },
  ] as AppRoute[],
  menu: [
    {
      id: "crm",
      label: "CRM",
      path: "/crm",
      icon: Contact,
      permission: "contact.read",
    },
  ] as MenuItem[],
  permissions: [
    "contact.read", "contact.create", "contact.update", "contact.delete",
    "lead.read", "lead.create", "lead.update", "lead.delete",
    "opportunity.read", "opportunity.create", "opportunity.update", "opportunity.delete",
    "campaign.read", "campaign.create", "campaign.update", "campaign.delete",
    "activity.read", "activity.create", "activity.update", "activity.delete",
  ],
};
