import { ModuleShell, crmMenuItems, crmModuleInfo, ShellNavItem } from "@kwim/shared-ui";
import { Dashboard, createPlaceholderPage } from "./pages";

const ContactsPage = createPlaceholderPage("Contacts", "Gérer les contacts");
const LeadsPage = createPlaceholderPage("Prospects", "Gérer les prospects");
const OpportunitiesPage = createPlaceholderPage("Opportunités", "Gérer les opportunités");
const CampaignsPage = createPlaceholderPage("Campagnes", "Gérer les campagnes marketing");
const ActivitiesPage = createPlaceholderPage("Activités", "Suivre les activités");

const pageComponents: Record<string, React.ComponentType> = {
  "dashboard": Dashboard,
  "contacts": ContactsPage,
  "leads": LeadsPage,
  "opportunities": OpportunitiesPage,
  "campaigns": CampaignsPage,
  "activities": ActivitiesPage,
};

const items: ShellNavItem[] = crmMenuItems.map((item) => ({
  ...item,
  component: pageComponents[item.key] || Dashboard,
}));

function App() {
  return (
    <ModuleShell
      title={crmModuleInfo.title}
      breadcrumbPath={crmModuleInfo.breadcrumbPath}
      items={items}
      defaultSelected="dashboard"
      enableSearch
    />
  );
}

export default App;
