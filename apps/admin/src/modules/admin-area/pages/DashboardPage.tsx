import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { setBreadCrumbItemsAction } from "@/store/actions/appActions";

import {
  getServerInfo,
  getPlatformFeatures,
  DASHBOARD_QUICK_ACTIONS,
  NEW_FUNCTIONALITY,
} from "../platformData";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

function StatusBadge({ status }: { status: string }) {
  const variant =
    status === "Supported"
      ? "default"
      : status === "Experimental"
        ? "secondary"
        : status === "Preview"
          ? "secondary"
          : "outline";
  const className =
    status === "Supported"
      ? "bg-emerald-600/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
      : status === "Deprecated"
        ? "text-amber-600 dark:text-amber-400 border-amber-500/50"
        : undefined;
  return (
    <Badge variant={variant} className={className}>
      {status}
    </Badge>
  );
}

export default function DashboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const { data, isLoading, isError } = useUserData();

  const serverInfo = getServerInfo();
  const features = getPlatformFeatures();
  const enabledFeatures = features.filter((f) => f.enabled);
  const disabledFeatures = features.filter((f) => !f.enabled);

  useEffect(() => {
    dispatch(setBreadCrumbItemsAction([{ name: "Dashboard", path: "/" }]));
    return () => {
      dispatch(setBreadCrumbItemsAction([]));
    };
  }, [dispatch]);

  return (
    <div className="p-4 space-y-4 text-gray-800 dark:text-gray-100">
      <div>
        <h1 className="text-xl font-semibold text-foreground">{APP_CONFIG.name} realm</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Administration console — welcome, platform info and features
        </p>
      </div>

      <Tabs defaultValue="welcome" className="w-full">
        <TabsList className="w-full justify-start border-b border-border rounded-none h-auto p-0 bg-transparent gap-0">
          <TabsTrigger
            value="welcome"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none"
          >
            Welcome
          </TabsTrigger>
          <TabsTrigger
            value="server-info"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none"
          >
            Server info
          </TabsTrigger>
          <TabsTrigger
            value="provider-info"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none"
          >
            Provider info
          </TabsTrigger>
        </TabsList>

        <TabsContent value="welcome" className="mt-4 space-y-6">
          {/* Welcome message */}
          <div className="bg-white dark:bg-[#1a1f3b] rounded-md p-5 shadow-sm transition-colors">
            <h2 className="text-lg font-semibold text-foreground mb-1">
              Welcome to the {APP_CONFIG.name} administration console
            </h2>
            <p className="text-muted-foreground text-sm">
              Use the tabs above to view server information and platform features. Below you can
              jump to modules or see what’s new.
            </p>
          </div>

          {/* Quick actions */}
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

          {/* New functionality */}
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

          {/* Stats */}
          {/* <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                title="Total Users"
                value={isLoading ? "..." : isError ? "Error" : data?.totalUsers ?? 0}
                icon={usersIcon}
                bgColor="bg-blue-100 dark:bg-blue-900"
              />
              <StatCard
                title="Active Trips"
                value={isLoading ? "..." : isError ? "Error" : data?.activeTrips ?? 0}
                icon={agenda}
                bgColor="bg-green-100 dark:bg-green-900"
              />
              <StatCard
                title="Revenue"
                value={
                  isLoading
                    ? "..."
                    : isError
                      ? "Error"
                      : `${data?.totalRevenue ?? 0} ${APP_CONFIG.currency}`
                }
                icon={usersIcon}
                bgColor="bg-purple-100 dark:bg-purple-900"
              />
            </div>
          </div> */}

          {/* Charts and table */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-[#1a1f3b] rounded-md p-4 shadow-sm transition-colors">
              <h3 className="font-medium mb-4">Reservations Overview</h3>
              <PieChart />
            </div>
            <div className="bg-white dark:bg-[#1a1f3b] rounded-md p-4 shadow-sm transition-colors">
              <h3 className="font-medium mb-4">Recent Activities</h3>
              <TableDashbord />
            </div>
          </div> */}
        </TabsContent>

        <TabsContent value="server-info" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#1a1f3b] rounded-md shadow-sm transition-colors overflow-hidden">
              <h2 className="px-4 py-3 text-sm font-semibold border-b border-border bg-muted/30">
                Server info
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody>
                    {serverInfo.map((row) => (
                      <tr
                        key={row.name}
                        className="border-b border-border last:border-0 hover:bg-muted/20"
                      >
                        <td className="py-2.5 px-4 font-medium text-muted-foreground w-[40%]">
                          {row.name}
                        </td>
                        <td className="py-2.5 px-4">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="bg-white dark:bg-[#1a1f3b] rounded-md shadow-sm transition-colors overflow-hidden">
              <h2 className="px-4 py-3 text-sm font-semibold border-b border-border bg-muted/30">
                Profile
              </h2>
              <div className="p-4 text-sm text-muted-foreground">
                <p>
                  This application runs the {APP_CONFIG.name} platform with the modules and features
                  listed under the &quot;Provider info&quot; tab. Server info reflects current
                  environment and app settings.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="provider-info" className="mt-4 space-y-6">
          <div className="bg-white dark:bg-[#1a1f3b] rounded-md shadow-sm transition-colors overflow-hidden">
            <h2 className="px-4 py-3 text-sm font-semibold border-b border-border bg-muted/30">
              Enabled features
            </h2>
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
                    <th className="py-2.5 px-4 text-left font-medium text-muted-foreground w-32">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {enabledFeatures.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-6 px-4 text-center text-muted-foreground">
                        No enabled features
                      </td>
                    </tr>
                  ) : (
                    enabledFeatures.map((f) => (
                      <tr
                        key={f.id}
                        className="border-b border-border last:border-0 hover:bg-muted/20"
                      >
                        <td className="py-2.5 px-4 font-medium">{f.name}</td>
                        <td className="py-2.5 px-4 text-muted-foreground">{f.description}</td>
                        <td className="py-2.5 px-4">
                          <StatusBadge status={f.status} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-white dark:bg-[#1a1f3b] rounded-md shadow-sm transition-colors overflow-hidden">
            <h2 className="px-4 py-3 text-sm font-semibold border-b border-border bg-muted/30">
              Disabled features
            </h2>
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
                    <th className="py-2.5 px-4 text-left font-medium text-muted-foreground w-32">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {disabledFeatures.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-6 px-4 text-center text-muted-foreground">
                        No disabled features
                      </td>
                    </tr>
                  ) : (
                    disabledFeatures.map((f) => (
                      <tr
                        key={f.id}
                        className="border-b border-border last:border-0 hover:bg-muted/20"
                      >
                        <td className="py-2.5 px-4 font-medium">{f.name}</td>
                        <td className="py-2.5 px-4 text-muted-foreground">{f.description}</td>
                        <td className="py-2.5 px-4">
                          <StatusBadge status={f.status} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
