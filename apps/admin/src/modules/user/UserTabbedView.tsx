/**
 * UserTabbedView — Same structure as HrTabbedView
 *
 * Shows user/access entities (Utilisateurs, Groupes, Rôles, Sessions)
 * as horizontal tabs in the content area.
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
import { cn } from "@/lib/utils";
import UserNew from "./pages/users/UserNew";
import GroupNew from "./pages/groups/GroupNew";
import RoleNew from "./pages/roles/RoleNew";
import UserSessionNew from "./pages/sessions/UserSessionNew";

// ─── Tab config: key, label, icon, component ───────────────────
const USER_TABS: {
  key: string;
  label: string;
  icon: LucideIcon;
  component: ComponentType;
}[] = [
  { key: "users", label: "Utilisateurs", icon: SquareUser, component: UserNew },
  { key: "groups", label: "Groupes", icon: Group, component: GroupNew },
  { key: "roles", label: "Rôles", icon: GitFork, component: RoleNew },
  { key: "sessions", label: "Sessions", icon: BookUser, component: UserSessionNew },
];

export default function UserTabbedView() {
  const [activeKey, setActiveKey] = useState(USER_TABS[0].key);
  const activeTab = USER_TABS.find((t) => t.key === activeKey);
  const ActiveComponent = activeTab?.component ?? (() => null);

  return (
    <div className="flex flex-col h-full">
      {/* Horizontal tabs — same style as HR */}
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

      {/* Tab content */}
      <div className="flex-1 min-h-0 overflow-auto pt-2">
        <ActiveComponent />
      </div>
    </div>
  );
}
