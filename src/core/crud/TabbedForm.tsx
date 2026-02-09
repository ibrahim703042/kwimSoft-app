/**
 * TabbedForm — Odoo-like notebook tabs for form dialogs
 *
 * Organizes form fields into tabs, like Odoo's notebook widget.
 * Each tab can contain DynamicFormFields, custom content, or both.
 *
 * Usage:
 *   <TabbedForm
 *     form={form}
 *     tabs={[
 *       { key: "general", label: "Général", fields: [...] },
 *       { key: "pricing", label: "Tarification", fields: [...] },
 *       { key: "variants", label: "Variantes", render: (form) => <CustomContent /> },
 *     ]}
 *   />
 */
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { DynamicFormFields, FieldConfig } from "./DynamicFormFields";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────

export interface FormTab {
  /** Unique key */
  key: string;
  /** Tab label */
  label: string;
  /** Icon component (optional) */
  icon?: React.ReactNode;
  /** Fields for DynamicFormFields (if using config-driven approach) */
  fields?: FieldConfig[];
  /** Number of columns for the field grid */
  columns?: 1 | 2;
  /** Custom render function (overrides fields) */
  render?: (form: UseFormReturn<any>) => React.ReactNode;
  /** Badge count (e.g. number of items) */
  badge?: number;
}

interface TabbedFormProps {
  form: UseFormReturn<any>;
  tabs: FormTab[];
  /** Default active tab key */
  defaultTab?: string;
}

// ─── Component ────────────────────────────────────────────────

export function TabbedForm({ form, tabs, defaultTab }: TabbedFormProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.key || "");

  const currentTab = tabs.find((t) => t.key === activeTab);

  return (
    <div className="space-y-4">
      {/* Tab headers — Odoo-style underline tabs */}
      <div className="border-b">
        <nav className="flex gap-0 -mb-px overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                activeTab === tab.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
              )}
            >
              <span className="flex items-center gap-2">
                {tab.icon}
                {tab.label}
                {typeof tab.badge === "number" && tab.badge > 0 && (
                  <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 text-xs rounded-full bg-primary/10 text-primary">
                    {tab.badge}
                  </span>
                )}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      <div className="min-h-[200px]">
        {currentTab?.render ? (
          currentTab.render(form)
        ) : currentTab?.fields ? (
          <DynamicFormFields
            form={form}
            fields={currentTab.fields}
            columns={currentTab.columns}
          />
        ) : (
          <div className="text-muted-foreground text-sm py-8 text-center">
            Aucun contenu pour cet onglet.
          </div>
        )}
      </div>
    </div>
  );
}
