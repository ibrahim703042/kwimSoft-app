/**
 * ModuleDashboard — Reusable dashboard component with stat cards + charts
 *
 * Config-driven: pass stat definitions and chart configs, get a beautiful dashboard.
 * Uses recharts (already installed) for charts and shadcn cards for stats.
 */
import { ComponentType, ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { Button } from "@kwim/shared-ui";

// ─── Types ────────────────────────────────────────────────────

export interface StatCardConfig {
  key: string;
  label: string;
  icon: LucideIcon | ComponentType<any>;
  color: string;
  /** Static value or function to extract from API data */
  getValue: (data: any) => string | number;
}

export interface ChartConfig {
  key: string;
  title: string;
  type: "bar" | "line" | "area" | "pie";
  /** Data key(s) for chart series */
  dataKeys: { key: string; color: string; label?: string }[];
  /** X-axis key (for bar/line/area) */
  xAxisKey?: string;
  /** Name key (for pie) */
  nameKey?: string;
  /** Function to extract chart data from API response */
  getData: (data: any) => any[];
  /** Grid span: 1 or 2 (default 1) */
  span?: 1 | 2;
}

export interface DashboardConfig {
  /** Query key for fetching dashboard data */
  queryKey: string[];
  /** API function to fetch dashboard data */
  queryFn: () => Promise<any>;
  /** Stat card definitions */
  stats: StatCardConfig[];
  /** Chart definitions */
  charts?: ChartConfig[];
  /** Custom content after stats/charts */
  extra?: ReactNode;
}

// ─── Predefined colors ───────────────────────────────────────

const PIE_COLORS = [
  "#3b82f6", "#10b981", "#f59e0b", "#ef4444",
  "#8b5cf6", "#06b6d4", "#f97316", "#ec4899",
];

// ─── StatCard Component ──────────────────────────────────────

function DashStatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon | ComponentType<any>;
  color: string;
}) {
  return (
    <div className="bg-white dark:bg-[#1a1f3b] rounded-xl border border-border/40 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div
          className="rounded-lg p-2.5"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Chart Wrapper ────────────────────────────────────────────

function DashChart({ config, data }: { config: ChartConfig; data: any[] }) {
  const chartData = data.length > 0 ? data : [];

  return (
    <div
      className={`bg-white dark:bg-[#1a1f3b] rounded-xl border border-border/40 p-4 shadow-sm ${
        config.span === 2 ? "sm:col-span-2" : ""
      }`}
    >
      <h3 className="text-sm font-semibold text-foreground mb-3">
        {config.title}
      </h3>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          {config.type === "bar" ? (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis
                dataKey={config.xAxisKey}
                tick={{ fontSize: 11 }}
                tickLine={false}
              />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {config.dataKeys.map((dk) => (
                <Bar
                  key={dk.key}
                  dataKey={dk.key}
                  fill={dk.color}
                  name={dk.label || dk.key}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          ) : config.type === "line" ? (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis
                dataKey={config.xAxisKey}
                tick={{ fontSize: 11 }}
                tickLine={false}
              />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {config.dataKeys.map((dk) => (
                <Line
                  key={dk.key}
                  type="monotone"
                  dataKey={dk.key}
                  stroke={dk.color}
                  name={dk.label || dk.key}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              ))}
            </LineChart>
          ) : config.type === "area" ? (
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis
                dataKey={config.xAxisKey}
                tick={{ fontSize: 11 }}
                tickLine={false}
              />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {config.dataKeys.map((dk) => (
                <Area
                  key={dk.key}
                  type="monotone"
                  dataKey={dk.key}
                  stroke={dk.color}
                  fill={`${dk.color}30`}
                  name={dk.label || dk.key}
                  strokeWidth={2}
                />
              ))}
            </AreaChart>
          ) : (
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={3}
                dataKey={config.dataKeys[0]?.key || "value"}
                nameKey={config.nameKey || "name"}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── Main Dashboard Component ────────────────────────────────

export function ModuleDashboard({ config }: { config: DashboardConfig }) {
  const { data: response, isLoading, error, refetch } = useQuery({
    queryKey: config.queryKey,
    queryFn: async () => {
      try {
        const res = await config.queryFn();
        return res?.data || res || {};
      } catch {
        return {};
      }
    },
    staleTime: 30000,
    retry: 1,
  });

  const apiData = response || {};

  if (error && !apiData) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
        <p className="text-sm">Impossible de charger le tableau de bord.</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {config.stats.map((stat) => (
          <DashStatCard
            key={stat.key}
            label={stat.label}
            value={isLoading ? "..." : stat.getValue(apiData)}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Charts */}
      {config.charts && config.charts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {config.charts.map((chart) => (
            <DashChart
              key={chart.key}
              config={chart}
              data={isLoading ? [] : chart.getData(apiData)}
            />
          ))}
        </div>
      )}

      {/* Extra content */}
      {config.extra}
    </div>
  );
}
