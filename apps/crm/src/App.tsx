import { AppLayout, type AppLayoutConfig, ModuleShell, crmMenuItems, crmModuleInfo, ShellNavItem } from "@kwim/shared-ui";
import { crmModuleConfig } from "./config/module.config";
import { useNavigate } from "react-router-dom";
import { Users, UserPlus, Target, Mail, Activity } from "lucide-react";
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
  const navigate = useNavigate();

  const config: AppLayoutConfig = {
    appName: "KwimSoft CRM",
    menus: crmModuleConfig.menu,
    user: {
      fullName: "CRM User",
      email: "crm@kwimsoft.com",
      role: "Sales Manager",
    },
    quickActions: [
      {
        icon: UserPlus,
        label: "Nouveau contact",
        description: "Ajouter un contact",
        shortcut: "⌘N",
        onClick: () => navigate("/contacts/new"),
      },
      {
        icon: Target,
        label: "Nouveau prospect",
        description: "Ajouter un prospect",
        onClick: () => navigate("/leads/new"),
      },
      {
        icon: Mail,
        label: "Campagne",
        description: "Créer une campagne",
        onClick: () => navigate("/campaigns/new"),
      },
      {
        icon: Activity,
        label: "Activité",
        description: "Enregistrer une activité",
        onClick: () => navigate("/activities/new"),
      },
    ],
    notifications: [
      {
        id: "1",
        title: "Nouveau prospect",
        message: "Un nouveau prospect a été ajouté",
        type: "info",
        time: "10 min ago",
        read: false,
      },
    ],
    onLogout: () => {
      localStorage.removeItem("token");
      window.location.href = "/login";
    },
    onProfile: () => navigate("/profile"),
    onSettings: () => navigate("/settings"),
  };

  return (
    <AppLayout config={config}>
      <ModuleShell
        title={crmModuleInfo.title}
        breadcrumbPath={crmModuleInfo.breadcrumbPath}
        items={items}
        defaultSelected="dashboard"
        enableSearch
      />
    </AppLayout>
  );
}

export default App;
