import { useNavigate } from "react-router-dom";
import {
  DASHBOARD_QUICK_ACTIONS,
  NEW_FUNCTIONALITY,
} from "../platformData";
import { APP_CONFIG } from "@/config";
import {
  Bus,
  Users,
  Package,
  Warehouse,
  Wallet,
  ShoppingCart,
  FileText,
  TrendingUp,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const QUICK_ACTION_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  transport: Bus,
  hr: Users,
  product: Package,
  inventory: Warehouse,
  finance: Wallet,
  sales: ShoppingCart,
  procurement: FileText,
  crm: TrendingUp,
  report: TrendingUp,
};

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="p-4 space-y-6 text-gray-800 dark:text-gray-100">
      <div className="bg-white dark:bg-[#1a1f3b] rounded-md p-5 shadow-sm transition-colors">
        <h2 className="text-lg font-semibold text-foreground mb-1">
          Welcome to the {APP_CONFIG.name} administration console
        </h2>
        <p className="text-muted-foreground text-sm">
          Use the tabs above to view server information and platform features. Below you can jump to
          modules or see what’s new.
        </p>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Quick actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {DASHBOARD_QUICK_ACTIONS.map((action) => {
            const Icon = QUICK_ACTION_ICONS[action.id] ?? ArrowRight;
            return (
              <button
                key={action.id}
                type="button"
                onClick={() => navigate(action.path)}
                className="flex items-start gap-3 p-4 rounded-lg border border-border bg-white dark:bg-[#1a1f3b] text-left hover:bg-muted/50 hover:border-primary/30 transition-colors"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground">{action.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{action.description}</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          New functionality
        </h3>
        <div className="bg-white dark:bg-[#1a1f3b] rounded-md shadow-sm transition-colors overflow-hidden border border-border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="py-2.5 px-4 text-left font-medium text-muted-foreground">
                    Feature
                  </th>
                  <th className="py-2.5 px-4 text-left font-medium text-muted-foreground">
                    Description
                  </th>
                  <th className="py-2.5 px-4 text-left font-medium text-muted-foreground w-24">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {NEW_FUNCTIONALITY.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-border last:border-0 hover:bg-muted/20"
                  >
                    <td className="py-2.5 px-4 font-medium">{item.title}</td>
                    <td className="py-2.5 px-4 text-muted-foreground">{item.description}</td>
                    <td className="py-2.5 px-4 text-muted-foreground">{item.date ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
