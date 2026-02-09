import { ComponentType, ReactNode, useState } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setBreadCrumbItemsAction } from "@/store/actions/appActions";
import {
  IndentDecrease,
  LucideIcon,
  Menu,
  ChevronRight,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────

export interface ShellNavItem {
  /** Unique key */
  key: string;
  /** Display label */
  label: string;
  /** Lucide icon component */
  icon: LucideIcon | ComponentType<{ size?: number }>;
  /** Component to render when selected (for tab-based navigation) */
  component?: ComponentType;
  /** Route path (for URL-based navigation) */
  path?: string;
}

export interface ModuleShellProps {
  /** Module title shown in the sidebar header */
  title: string;
  /** Breadcrumb path (e.g. "/administration") */
  breadcrumbPath?: string;
  /** Navigation items rendered in the sidebar */
  items: ShellNavItem[];
  /** Optional secondary items at the bottom of the sidebar */
  bottomItems?: ShellNavItem[];
  /** If true, show search bar in sidebar */
  enableSearch?: boolean;
  /** Optional header action (e.g. a grid/list toggle button) */
  headerAction?: ReactNode;
  /** Content to render instead of the selected component (for route-based shells) */
  children?: ReactNode;
  /** Default selected item key */
  defaultSelected?: string;
}

/**
 * ModuleShell — A reusable sidebar + content layout for module pages.
 *
 * Replaces the duplicated sidebar patterns in Administration, UserManagement,
 * and all grouped modules. Supports both:
 *
 * 1. **Tab mode** — items have `component` prop, shell manages which is active
 * 2. **Route mode** — items have `path` prop, content comes via `children`
 */
export function ModuleShell({
  title,
  breadcrumbPath,
  items,
  bottomItems = [],
  enableSearch = false,
  headerAction,
  children,
  defaultSelected,
}: ModuleShellProps) {
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState(
    defaultSelected || items[0]?.key || ""
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Breadcrumb
  useEffect(() => {
    if (breadcrumbPath) {
      dispatch(
        setBreadCrumbItemsAction([{ path: breadcrumbPath, name: title }])
      );
    }
    return () => {
      dispatch(setBreadCrumbItemsAction([]));
    };
  }, [dispatch, breadcrumbPath, title]);

  const toggle = () => setCollapsed((p) => !p);

  // Determine if this is "tab mode" (components in items) or "route mode" (children)
  const isTabMode = !children && items.some((i) => i.component);

  const SelectedComponent =
    isTabMode
      ? items.find((i) => i.key === selectedKey)?.component || null
      : null;

  // Filter items by search
  const filtered =
    searchQuery.trim()
      ? items.filter((i) =>
        i.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
      : items;

  return (
    <div>
      {/* Mobile header */}
      <div className="p-4 bg-background mb-2 rounded-lg shadow-sm md:hidden flex justify-between items-center">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <button
          className="p-1 rounded-md bg-muted hover:bg-muted/80 transition-colors"
          onClick={toggle}
        >
          <Menu size={16} />
        </button>
      </div>

      <div className="flex gap-3 overflow-hidden">
        {/* Expand toggle (visible when collapsed) */}
        <div className={cn("absolute mt-0", collapsed ? "block" : "hidden")}>
          <div
            className="border mx-3 bg-background p-1 rotate-180 rounded-b-lg rounded-l-lg cursor-pointer hover:bg-muted transition-colors"
            onClick={toggle}
          >
            <IndentDecrease size={18} />
          </div>
        </div>

        {/* ── Sidebar ──────────────────────────────────────── */}
        <div className="sm:block hidden">
          <div
            className={cn(
              "bg-background transition-all duration-200 rounded-2xl flex flex-col shadow-sm border border-border/40 fixed h-[calc(100vh-50px)]",
              collapsed ? "w-0 overflow-hidden" : "w-[270px]"
            )}
          >
            {/* Header */}
            <div className="px-5 pt-4 pb-2 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <p className="text-[0.95rem] font-semibold text-foreground truncate">
                  {title}
                </p>
                {headerAction}
              </div>
              <button
                className="border border-border/60 p-1 rounded-lg cursor-pointer hover:bg-muted transition-colors"
                onClick={toggle}
              >
                <IndentDecrease size={18} />
              </button>
            </div>

            <div className="mx-4 my-1 h-px bg-border/50" />

            {/* Search */}
            {enableSearch && (
              <div className="mx-4 mt-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/30 focus-within:border-primary/40 transition-colors">
                  <Search className="text-muted-foreground" size={14} />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent outline-none text-[0.8rem] flex-1 placeholder:text-muted-foreground/60"
                  />
                </div>
              </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto mt-1 px-3 py-2">
              <ul className="flex flex-col gap-0.5">
                {filtered.map((item) => {
                  const Icon = item.icon;
                  const isActive = isTabMode && item.key === selectedKey;

                  if (isTabMode) {
                    return (
                      <li key={item.key}>
                        <button
                          onClick={() => setSelectedKey(item.key)}
                          className={cn(
                            "w-full group relative flex items-center gap-2.5 rounded-lg py-2 px-3 text-[0.85rem] font-medium transition-all duration-150",
                            isActive
                              ? "bg-primary/10 text-primary border border-primary/20"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          )}
                        >
                          <Icon size={16} />
                          <span className="truncate">{item.label}</span>
                          {isActive && (
                            <ChevronRight
                              size={14}
                              className="ml-auto text-primary/60"
                            />
                          )}
                        </button>
                      </li>
                    );
                  }

                  // Route mode: use NavLink
                  return (
                    <li key={item.key}>
                      <NavLink
                        to={item.path || "#"}
                        className={({ isActive: routeActive }) =>
                          cn(
                            "group relative flex items-center gap-2.5 rounded-lg py-2 px-3 text-[0.85rem] font-medium transition-all duration-150",
                            routeActive
                              ? "bg-primary/10 text-primary border border-primary/20"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          )
                        }
                      >
                        {({ isActive: routeActive }) => (
                          <>
                            <Icon size={16} />
                            <span className="truncate">{item.label}</span>
                            {routeActive && (
                              <ChevronRight
                                size={14}
                                className="ml-auto text-primary/60"
                              />
                            )}
                          </>
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>

              {/* Bottom items */}
              {bottomItems.length > 0 && (
                <>
                  <div className="my-3 h-px bg-border/50" />
                  <ul className="flex flex-col gap-0.5">
                    {bottomItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <li key={item.key}>
                          <button
                            onClick={() =>
                              isTabMode
                                ? setSelectedKey(item.key)
                                : undefined
                            }
                            className={cn(
                              "w-full group relative flex items-center gap-2.5 rounded-lg py-2 px-3 text-[0.85rem] font-normal transition-all duration-150",
                              isTabMode && item.key === selectedKey
                                ? "bg-primary/10 text-primary border border-primary/20"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            )}
                          >
                            <Icon size={16} />
                            <span className="truncate">{item.label}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}
            </nav>
          </div>
        </div>

        {/* ── Content ──────────────────────────────────────── */}
        <div
          className={cn(
            "w-full transition-all duration-200",
            collapsed ? "ml-0" : "ml-[270px]"
          )}
        >
          {isTabMode && SelectedComponent ? (
            <SelectedComponent />
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
}
