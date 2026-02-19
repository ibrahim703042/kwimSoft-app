/**
 * GroupedModuleShell — Renders a ModuleShell with tab-based navigation
 * for auto-generated grouped modules (HR, Carwash, Finance, etc.).
 *
 * Each entity's CrudPage becomes a tab inside the shell sidebar.
 */
import { ComponentType, useMemo } from "react";
import { ModuleShell, ShellNavItem } from "@/core/ui";
import { ModuleEntityConfig, createListPage } from "./createModule";
import { LucideIcon, Table2 } from "lucide-react";

// Icon mapping — maps entity keys to appropriate lucide icons
// Falls back to Table2 for unmapped entities
const ENTITY_ICONS: Record<string, LucideIcon> = {};

// Lazy-load icons via dynamic import would be ideal, but for now
// we use a sensible default. Modules can pass custom icons via config.

function getEntityIcon(key: string): LucideIcon {
  return ENTITY_ICONS[key] || Table2;
}

interface GroupedModuleShellProps {
  /** Module display name */
  title: string;
  /** URL base path (for breadcrumb) */
  basePath: string;
  /** Entity configurations */
  entities: ModuleEntityConfig[];
  /** Optional custom icons map { entityKey: LucideIconComponent } */
  icons?: Record<string, LucideIcon>;
}

export function GroupedModuleShell({
  title,
  basePath,
  entities,
  icons,
}: GroupedModuleShellProps) {
  // Build shell nav items with generated list pages as components
  const items: ShellNavItem[] = useMemo(() => {
    return entities.map((entity) => {
      const ListPage = createListPage(entity);
      const iconMap = { ...ENTITY_ICONS, ...icons };
      const Icon = iconMap[entity.key] || getEntityIcon(entity.key);

      return {
        key: entity.key,
        label: entity.label,
        icon: Icon as ComponentType<{ size?: number }>,
        component: ListPage,
      };
    });
  }, [entities, icons]);

  return (
    <ModuleShell
      title={title}
      breadcrumbPath={basePath}
      items={items}
      enableSearch={entities.length > 4}
    />
  );
}
