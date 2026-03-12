import React, { useState, ReactNode } from "react";
import {
  Bell,
  CheckCheck,
  Trash2,
  Clock,
  AlertCircle,
  Info,
  CheckCircle,
  Plus,
  Moon,
  Sun,
  Laptop2,
  Globe,
  Home,
  ChevronRight,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Search,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
  DropdownMenuGroup,
} from "../components/ui/dropdown-menu";
import { useThemeStore, type Theme } from "../stores/useThemeStore";
import { useLanguageStore } from "../stores/useLanguageStore";
import { cn } from "../lib/utils";

type NotificationType = "info" | "success" | "warning" | "error";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  time: string;
  read: boolean;
}

interface QuickAction {
  icon: React.ElementType;
  label: string;
  description?: string;
  shortcut?: string;
  onClick: () => void;
}

interface Language {
  code: string;
  name: string;
  flag?: string;
}

interface BreadcrumbItem {
  path: string;
  name: string;
}

interface LayoutNavbarProps {
  user?: {
    fullName?: string;
    email?: string;
    role?: string;
    avatar?: string;
  };
  quickActions?: QuickAction[];
  notifications?: Notification[];
  languages?: Language[];
  breadcrumbs?: BreadcrumbItem[];
  currentPath?: string;
  onLogout?: () => void;
  onSearch?: (query: string) => void;
  onViewAllNotifications?: () => void;
  onNavigate?: (path: string) => void;
  showQuickActions?: boolean;
  showNotifications?: boolean;
  showLanguageSwitcher?: boolean;
  showThemeToggle?: boolean;
  LinkComponent?: React.ComponentType<{ to: string; className?: string; children: ReactNode }>;
}

export function LayoutNavbar({
  user,
  quickActions = [],
  notifications: initialNotifications = [],
  languages,
  breadcrumbs,
  currentPath,
  onLogout,
  onSearch,
  onViewAllNotifications,
  onNavigate,
  showQuickActions = true,
  showNotifications = true,
  showLanguageSwitcher = true,
  showThemeToggle = true,
  LinkComponent,
}: LayoutNavbarProps) {
  const computedBreadcrumbs = breadcrumbs || generateBreadcrumbsFromPath(currentPath || "");

  return (
    <div className="flex flex-col gap-0 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="flex justify-between items-center h-14 px-4 sm:px-6 gap-4">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <NavBreadcrumbs
            items={computedBreadcrumbs}
            onNavigate={onNavigate}
            LinkComponent={LinkComponent}
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <NavSearch onSearch={onSearch} />

          <div className="hidden sm:block h-6 w-px bg-border" />

          {showQuickActions && quickActions.length > 0 && (
            <NavQuickActions actions={quickActions} />
          )}

          <div className="flex items-center gap-1">
            {showThemeToggle && <NavThemeToggle />}
            {showLanguageSwitcher && <NavLanguageSwitcher languages={languages} />}
            {showNotifications && (
              <NavNotifications
                notifications={initialNotifications}
                onViewAll={onViewAllNotifications}
              />
            )}
          </div>

          <div className="h-6 w-px bg-border" />

          <NavUserDropdown user={user} onLogout={onLogout} />
        </div>
      </div>
    </div>
  );
}

function generateBreadcrumbsFromPath(pathname: string): BreadcrumbItem[] {
  const pathSegments = pathname.split("/").filter(Boolean);

  const formatSegment = (segment: string): string => {
    return segment
      .replace(/-/g, " ")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char: string) => char.toUpperCase());
  };

  return pathSegments.map((segment: string, index: number) => ({
    path: "/" + pathSegments.slice(0, index + 1).join("/"),
    name: formatSegment(segment),
  }));
}

function NavBreadcrumbs({
  items,
  onNavigate,
  LinkComponent,
}: {
  items: BreadcrumbItem[];
  onNavigate?: (path: string) => void;
  LinkComponent?: React.ComponentType<{ to: string; className?: string; children: ReactNode }>;
}) {
  if (items.length === 0) {
    return null;
  }

  const handleClick = (path: string) => (e: React.MouseEvent) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(path);
    }
  };

  const Link = LinkComponent || (({ to, className, children }: { to: string; className?: string; children: ReactNode }) => (
    <a href={to} className={className} onClick={handleClick(to)}>
      {children}
    </a>
  ));

  return (
    <nav className="flex items-center text-sm">
      <Link
        to="/"
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <Home size={16} />
      </Link>
      {items.map((item: BreadcrumbItem, index: number) => (
        <React.Fragment key={item.path}>
          <ChevronRight size={14} className="mx-2 text-muted-foreground" />
          {index === items.length - 1 ? (
            <span className="font-medium text-foreground">{item.name}</span>
          ) : (
            <Link
              to={item.path}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.name}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

function NavSearch({ onSearch }: { onSearch?: (query: string) => void }) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
  };

  const handleBlur = () => {
    if (!query.trim()) setExpanded(false);
  };

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-0"
        aria-label="Search"
      >
        <Search size={18} className="text-gray-600 dark:text-gray-300" />
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onBlur={handleBlur}
        placeholder="Search..."
        autoFocus
        className="pl-9 pr-3 py-1.5 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 w-40 sm:w-52"
      />
    </form>
  );
}

function NavThemeToggle() {
  const { theme, setTheme } = useThemeStore();

  const themes = [
    { label: "Light", value: "light" as Theme, icon: <Sun size={16} /> },
    { label: "Dark", value: "dark" as Theme, icon: <Moon size={16} /> },
    { label: "System", value: "system" as Theme, icon: <Laptop2 size={16} /> },
  ];

  return (
    <div className="relative group">
      <button
        type="button"
        className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition focus:outline-none focus:ring-0"
        aria-label="Theme Menu"
      >
        {themes.find((t) => t.value === theme)?.icon}
      </button>
      <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 border rounded-md shadow-md opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50">
        {themes.map((t) => (
          <button
            key={t.value}
            onClick={() => setTheme(t.value)}
            className={`flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
              theme === t.value ? "font-semibold" : ""
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function NavLanguageSwitcher({ languages }: { languages?: Language[] }) {
  const { language, setLanguage } = useLanguageStore();
  const [showMenu, setShowMenu] = useState(false);

  const defaultLanguages: Language[] = [
    { code: "en", name: "English" },
    { code: "fr", name: "Français" },
  ];

  const availableLanguages = languages || defaultLanguages;
  const currentLang = availableLanguages.find((l) => l.code === language);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowMenu(!showMenu)}
        className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-1 focus:outline-none focus:ring-0"
        aria-label="Language"
      >
        {currentLang?.flag ? (
          <img src={currentLang.flag} alt="" className="w-5 h-5 rounded-full" />
        ) : (
          <Globe size={16} />
        )}
      </button>
      {showMenu && (
        <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 border rounded-md shadow-lg z-50">
          {availableLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setShowMenu(false);
              }}
              className={`flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                language === lang.code ? "bg-gray-50 dark:bg-gray-700" : ""
              }`}
            >
              {lang.flag ? (
                <img src={lang.flag} alt="" className="w-4 h-4 rounded-full" />
              ) : (
                <span className="text-xs font-medium uppercase">{lang.code}</span>
              )}
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function NavNotifications({
  notifications: initialNotifications,
  onViewAll,
}: {
  notifications: Notification[];
  onViewAll?: () => void;
}) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const typeIcons: Record<NotificationType, React.ElementType> = {
    info: Info,
    success: CheckCircle,
    warning: AlertCircle,
    error: AlertCircle,
  };

  const typeColors: Record<NotificationType, string> = {
    info: "text-blue-500 bg-blue-50 dark:bg-blue-900/20",
    success: "text-green-500 bg-green-50 dark:bg-green-900/20",
    warning: "text-amber-500 bg-amber-50 dark:bg-amber-900/20",
    error: "text-red-500 bg-red-50 dark:bg-red-900/20",
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="relative p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-0"
          aria-label="Notifications"
        >
          <Bell size={18} className="text-gray-600 dark:text-gray-300" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 flex items-center justify-center min-w-[14px] h-[14px] px-0.5 text-[10px] font-bold text-white bg-red-500 rounded-full leading-none">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <DropdownMenuLabel className="p-0 text-sm font-semibold">
            Notifications
          </DropdownMenuLabel>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="p-1.5 rounded-md hover:bg-muted transition-colors"
                title="Mark all as read"
              >
                <CheckCheck size={14} className="text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        <div className="max-h-[320px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Bell size={32} className="mb-2 opacity-50" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            notifications.map((notification) => {
              const Icon = typeIcons[notification.type];
              return (
                <div
                  key={notification.id}
                  className={cn(
                    "relative px-4 py-3 border-b border-border/50 last:border-0 hover:bg-muted/50 transition-colors cursor-pointer group",
                    !notification.read && "bg-primary/5"
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    <div
                      className={cn(
                        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                        typeColors[notification.type]
                      )}
                    >
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-sm truncate",
                          !notification.read
                            ? "font-semibold text-foreground"
                            : "font-medium text-muted-foreground"
                        )}
                      >
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground/70">
                        <Clock size={10} />
                        <span>{notification.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      className="p-1 rounded hover:bg-background text-red-500"
                      title="Delete"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <DropdownMenuSeparator className="m-0" />
        <DropdownMenuItem
          className="justify-center py-2.5 text-sm font-medium text-primary cursor-pointer"
          onClick={onViewAll}
        >
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NavQuickActions({ actions }: { actions: QuickAction[] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium transition-colors focus:outline-none shadow-sm">
          <Plus size={16} />
          <span className="hidden sm:inline">Create</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {actions.map((action) => (
          <DropdownMenuItem
            key={action.label}
            onClick={action.onClick}
            className="flex items-center gap-2 cursor-pointer py-2"
          >
            <div className="flex items-center justify-center w-7 h-7 rounded-md bg-muted">
              <action.icon size={14} className="text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{action.label}</p>
              {action.description && (
                <p className="text-xs text-muted-foreground">{action.description}</p>
              )}
            </div>
            {action.shortcut && (
              <DropdownMenuShortcut>{action.shortcut}</DropdownMenuShortcut>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NavUserDropdown({
  user,
  onLogout,
}: {
  user?: { fullName?: string; email?: string; role?: string; avatar?: string };
  onLogout?: () => void;
}) {
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 p-1.5 pr-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none">
          <div className="relative">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="User"
                className="h-8 w-8 rounded-full border-2 border-primary/20 shadow-sm"
              />
            ) : (
              <div className="h-8 w-8 rounded-full border-2 border-primary/20 shadow-sm bg-muted flex items-center justify-center">
                <User size={16} className="text-muted-foreground" />
              </div>
            )}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 leading-tight">
              {user?.fullName || "User"}
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
              {user?.role || "Member"}
            </p>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <p className="font-medium">{user?.fullName || "User"}</p>
          <p className="text-xs text-muted-foreground">{user?.email || ""}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <HelpCircle className="mr-2 h-4 w-4" />
          Help
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
