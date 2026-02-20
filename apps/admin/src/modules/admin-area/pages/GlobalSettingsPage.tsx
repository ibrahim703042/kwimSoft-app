/**
 * Global settings — app config (read-only) and feature flags with enable/disable toggles.
 * Overrides are persisted in localStorage and reflected in Provider info.
 */
import { useState, useCallback } from "react";
import { APP_CONFIG, FEATURES } from "@/config";
import { useAuthStore } from "@/core/auth";
import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getEffectiveFeatureFlags,
  setFeatureOverride,
  resetFeatureOverrides,
} from "../lib/featureFlags";
import { appendAuditEvent } from "../lib/auditLog";

function formatKey(key: string): string {
  return key.replace(/^enable/, "").replace(/([A-Z])/g, " $1").trim();
}

export default function GlobalSettingsPage() {
  const { user } = useAuthStore();
  const displayUser = user?.username || user?.email || "unknown";

  const [flags, setFlags] = useState<Record<string, boolean>>(getEffectiveFeatureFlags);

  const handleToggle = useCallback(
    (key: string, next: boolean) => {
      setFeatureOverride(key, next);
      setFlags(getEffectiveFeatureFlags());
      appendAuditEvent({
        user: displayUser,
        action: next ? "Feature enabled" : "Feature disabled",
        resource: key,
        meta: { feature: key, value: next },
      });
    },
    [displayUser]
  );

  const handleReset = useCallback(() => {
    resetFeatureOverrides();
    setFlags(getEffectiveFeatureFlags());
    appendAuditEvent({
      user: displayUser,
      action: "Feature overrides reset",
      resource: "Global settings",
    });
  }, [displayUser]);

  const defaultKeys = Object.keys(FEATURES as Record<string, boolean>);

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        <Settings2 size={18} />
        <span>Application config and feature flags. Toggle overrides are saved and logged.</span>
      </div>

      <div className="bg-white dark:bg-[#1a1f3b] rounded-md shadow-sm border border-border overflow-hidden">
        <h3 className="px-4 py-3 text-sm font-semibold border-b border-border bg-muted/30">
          Application
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border">
                <td className="py-2.5 px-4 font-medium text-muted-foreground w-40">Name</td>
                <td className="py-2.5 px-4">{APP_CONFIG.name}</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2.5 px-4 font-medium text-muted-foreground">Version</td>
                <td className="py-2.5 px-4">{APP_CONFIG.version}</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2.5 px-4 font-medium text-muted-foreground">Language</td>
                <td className="py-2.5 px-4">{APP_CONFIG.defaultLanguage}</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2.5 px-4 font-medium text-muted-foreground">Currency</td>
                <td className="py-2.5 px-4">{APP_CONFIG.currency}</td>
              </tr>
              <tr className="border-border">
                <td className="py-2.5 px-4 font-medium text-muted-foreground">API timeout</td>
                <td className="py-2.5 px-4">{APP_CONFIG.api.timeout} ms</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1a1f3b] rounded-md shadow-sm border border-border overflow-hidden">
        <div className="px-4 py-3 text-sm font-semibold border-b border-border bg-muted/30 flex items-center justify-between">
          <span>Feature flags</span>
          <Button variant="outline" size="sm" onClick={handleReset}>
            Reset to defaults
          </Button>
        </div>
        <div className="p-4 space-y-2">
          {defaultKeys.map((key) => {
            const value = flags[key] ?? false;
            return (
              <div
                key={key}
                className="flex items-center justify-between gap-4 py-2 px-3 rounded-lg border border-border/50 hover:bg-muted/20"
              >
                <span className="text-sm font-medium text-foreground">{formatKey(key)}</span>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant={value ? "default" : "outline"}
                    onClick={() => handleToggle(key, true)}
                  >
                    Enable
                  </Button>
                  <Button
                    size="sm"
                    variant={!value ? "default" : "outline"}
                    onClick={() => handleToggle(key, false)}
                  >
                    Disable
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
