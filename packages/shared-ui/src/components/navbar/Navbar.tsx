import { QuickAction } from "../../types/module";

interface NavbarProps {
  readonly breadcrumbs?: React.ReactNode;
  readonly search?: React.ReactNode;
  readonly quickActions?: QuickAction[];
  readonly languageSwitcher?: React.ReactNode;
  readonly themeToggle?: React.ReactNode;
  readonly notifications?: React.ReactNode;
  readonly userDropdown?: React.ReactNode;
}

/**
 * Reusable Navbar component for all module apps
 */
export function Navbar({
  breadcrumbs,
  search,
  quickActions = [],
  languageSwitcher,
  themeToggle,
  notifications,
  userDropdown,
}: Readonly<NavbarProps>) {
  return (
    <div className="flex flex-col gap-0">
      <div className="flex justify-between items-center px-4 sm:px-5 bg-card text-card-foreground h-14 rounded-lg shadow-sm border border-border">
        <div className="flex items-center gap-4">{breadcrumbs}</div>

        <div className="flex items-center gap-2 sm:gap-3">
          {search}

          {search && <div className="hidden sm:block h-6 w-px bg-border" />}

          {quickActions.length > 0 && <QuickActionsDropdown actions={quickActions} />}

          <div className="flex items-center gap-1">
            {themeToggle}
            {languageSwitcher}
            {notifications}
          </div>

          {userDropdown && (
            <>
              <div className="h-6 w-px bg-border" />
              {userDropdown}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function QuickActionsDropdown({ actions }: Readonly<{ actions: readonly QuickAction[] }>) {
  if (actions.length === 0) return null;
  
  return (
    <div className="relative">
      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium transition-colors">
        <span>+</span>
        <span className="hidden sm:inline">Create</span>
      </button>
    </div>
  );
}
