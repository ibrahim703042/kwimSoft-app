/**
 * UserShell - User Management Shell
 *
 * Displays user-related entities (Users, Groups, Roles, Sessions)
 * using the ModuleShell with tabbed navigation.
 */
import { useState } from "react";
import { ComponentType } from "react";
import {
  SquareUser,
  Group,
  GitFork,
  BookUser,
  LucideIcon,
} from "lucide-react";
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const UserPlaceholder = ({ title }: { title: string }) => (
  <div className="p-6 text-center text-muted-foreground">
    <p className="text-lg font-medium">{title}</p>
    <p className="text-sm mt-2">Cette fonctionnalité sera bientôt disponible.</p>
  </div>
);

const UsersPage = () => <UserPlaceholder title="Gestion des Utilisateurs" />;
const GroupsPage = () => <UserPlaceholder title="Gestion des Groupes" />;
const RolesPage = () => <UserPlaceholder title="Gestion des Rôles" />;
const SessionsPage = () => <UserPlaceholder title="Sessions Actives" />;

const USER_TABS: {
  key: string;
  label: string;
  icon: LucideIcon;
  component: ComponentType;
}[] = [
  { key: "users", label: "Utilisateurs", icon: SquareUser, component: UsersPage },
  { key: "groups", label: "Groupes", icon: Group, component: GroupsPage },
  { key: "roles", label: "Rôles", icon: GitFork, component: RolesPage },
  { key: "sessions", label: "Sessions", icon: BookUser, component: SessionsPage },
];

export default function UserShell() {
  const [activeKey, setActiveKey] = useState(USER_TABS[0].key);
  const activeTab = USER_TABS.find((t) => t.key === activeKey);
  const ActiveComponent = activeTab?.component ?? (() => null);

  return (
    <div className="flex flex-col h-full">
      <div className="border-b bg-muted/30 shrink-0">
        <nav
          className="flex gap-0 overflow-x-auto scrollbar-thin"
          aria-label="Gestion utilisateurs"
        >
          {USER_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeKey === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveKey(tab.key)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                  isActive
                    ? "border-[#0F123F] text-[#0F123F] bg-background"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
                )}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex-1 min-h-0 overflow-auto pt-2">
        <ActiveComponent />
      </div>
    </div>
  );
}
