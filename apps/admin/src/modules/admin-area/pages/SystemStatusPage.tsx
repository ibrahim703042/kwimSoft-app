/**
 * System status — checks if configured API URLs (from .env / config) are reachable.
 */
import { useState, useEffect, useCallback } from "react";
import { API_CONFIG } from "@/config";
import { CheckCircle2, XCircle, Loader2, Server, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { checkUrlReachable, type HealthResult } from "../lib/healthCheck";

const services = [
  { key: "userManagement", label: "User Management" },
  { key: "transport", label: "Transport" },
  { key: "product", label: "Product" },
  { key: "hr", label: "HR" },
  { key: "stock", label: "Stock / Inventory" },
  { key: "gateway", label: "Gateway" },
  { key: "upload", label: "Upload" },
] as const;

type ServiceKey = (typeof services)[number]["key"];

type ServiceStatus =
  | { state: "idle" }
  | { state: "checking" }
  | { state: "connected"; statusCode: number }
  | { state: "failed"; error: string };

function getBaseUrl(key: ServiceKey): string {
  const config = API_CONFIG[key as keyof typeof API_CONFIG];
  return (config as { baseUrl?: string } | undefined)?.baseUrl ?? "—";
}

export default function SystemStatusPage() {
  const [statuses, setStatuses] = useState<Record<ServiceKey, ServiceStatus>>(() => {
    const init: Record<string, ServiceStatus> = {};
    services.forEach((s) => (init[s.key] = { state: "idle" }));
    return init as Record<ServiceKey, ServiceStatus>;
  });

  const runChecks = useCallback(async () => {
    services.forEach((s) => setStatuses((prev) => ({ ...prev, [s.key]: { state: "checking" } })));

    const results = await Promise.all(
      services.map(async (s) => {
        const baseUrl = getBaseUrl(s.key);
        const result: HealthResult = await checkUrlReachable(baseUrl);
        return { key: s.key, result } as const;
      })
    );

    setStatuses((prev) => {
      const next = { ...prev };
      results.forEach(({ key, result }) => {
        if (result.status === "connected") {
          next[key as ServiceKey] = { state: "connected", statusCode: result.statusCode };
        } else {
          next[key as ServiceKey] = { state: "failed", error: result.error };
        }
      });
      return next;
    });
  }, []);

  useEffect(() => {
    runChecks();
  }, [runChecks]);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Server size={18} />
          <span>
            Configured from VITE_API_HOST (.env). Each URL is checked for connectivity.
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={runChecks}>
          <RefreshCw size={14} className="mr-1" />
          Refresh
        </Button>
      </div>
      <div className="grid gap-3">
        {services.map(({ key, label }) => {
          const baseUrl = getBaseUrl(key);
          const st = statuses[key];
          return (
            <div
              key={key}
              className="flex items-center justify-between gap-4 p-4 rounded-lg border border-border bg-white dark:bg-[#1a1f3b]"
            >
              <div className="flex items-center gap-3 min-w-0">
                {st.state === "checking" && (
                  <Loader2 className="h-5 w-5 text-muted-foreground shrink-0 animate-spin" />
                )}
                {st.state === "connected" && (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                )}
                {st.state === "failed" && (
                  <XCircle className="h-5 w-5 text-destructive shrink-0" />
                )}
                {st.state === "idle" && (
                  <div className="h-5 w-5 shrink-0 rounded-full bg-muted" />
                )}
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{label}</p>
                  <p
                    className="text-xs text-muted-foreground truncate max-w-md"
                    title={baseUrl}
                  >
                    {baseUrl}
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-right">
                {st.state === "idle" && (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
                {st.state === "checking" && (
                  <span className="text-xs text-muted-foreground">Checking…</span>
                )}
                {st.state === "connected" && (
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    Connected ({st.statusCode})
                  </span>
                )}
                {st.state === "failed" && (
                  <span className="text-xs text-destructive" title={st.error}>
                    Failed — {st.error}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
