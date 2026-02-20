/**
 * AdminAreaTabbedView — Same structure as UserTabbedView
 *
 * Shows admin area content as horizontal tabs: Welcome | Server info | Provider info
 */
import { useState } from "react";
import { ComponentType } from "react";
import { LayoutDashboard, Server, Layers, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import WelcomePage from "./pages/WelcomePage";
import ServerInfoPage from "./pages/ServerInfoPage";
import ProviderInfoPage from "./pages/ProviderInfoPage";

const ADMIN_TABS: {
  key: string;
  label: string;
  icon: LucideIcon;
  component: ComponentType;
}[] = [
  { key: "welcome", label: "Welcome", icon: LayoutDashboard, component: WelcomePage },
  { key: "server-info", label: "Server info", icon: Server, component: ServerInfoPage },
  { key: "provider-info", label: "Provider info", icon: Layers, component: ProviderInfoPage },
];

export default function AdminAreaTabbedView() {
  const [activeKey, setActiveKey] = useState(ADMIN_TABS[0].key);
  const activeTab = ADMIN_TABS.find((t) => t.key === activeKey);
  const ActiveComponent = activeTab?.component ?? (() => null);

  return (
    <div className="flex flex-col h-full">
      <div className="border-b bg-muted/30 shrink-0">
        <nav
          className="flex gap-0 overflow-x-auto scrollbar-thin"
          aria-label="Admin area"
        >
          {ADMIN_TABS.map((tab) => {
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
                    ? "border-[#0F123F] text-[#0F123F] bg-background dark:border-primary dark:text-primary"
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
