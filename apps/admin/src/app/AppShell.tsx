import { useLocation, useNavigate, Link } from "react-router-dom";
import { AppLayout, type AppLayoutConfig } from "@kwim/shared-ui";
import { useAuthStore } from "@/core/auth";
import { AppRouter } from "./Router";
import { getAllMenus } from "./registerModules";
import { isLandingPage } from "@/utils/subdomain";

/**
 * Main application shell using shared-ui AppLayout.
 */
export function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const menus = getAllMenus();
  const showLanding = isLandingPage();

  const isSpecialPage =
    location.pathname.startsWith("/trajet") ||
    location.pathname.startsWith("/administration/map-detail");

  const isPublicRoute = ["/", "/diagnostic", "/trial", "/register", "/thanks/trial", "/odoo-enterprise/invite-users", "/create-enterprise", "/login", "/forgot-password", "/update-password"].includes(location.pathname);
  const isWelcomePage = location.pathname === "/welcome";

  if (showLanding) {
    return <AppRouter />;
  }
  if (isPublicRoute || isWelcomePage || !isAuthenticated) {
    return <AppRouter />;
  }

  const fullName = user ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username || "User" : "User";
  const role = user?.roles?.[0];
  const roleStr = typeof role === "string" ? role : (role as any)?.name ?? "Member";

  const config: AppLayoutConfig = {
    appName: "Kwim Admin",
    menus,
    user: user
      ? { fullName, email: user.email, role: roleStr, avatar: user.avatar }
      : undefined,
    currentPath: location.pathname,
    onLogout: () => {
      logout();
      window.location.href = "/login";
    },
    onProfile: () => navigate("/profile"),
    onSettings: () => navigate("/settings"),
    onNavigate: (path) => navigate(path),
    LinkComponent: ({ to, children, ...props }) => (
      <Link to={to} {...props}>
        {children}
      </Link>
    ),
    showSearch: true,
    showQuickActions: false,
    showNotifications: true,
    showLanguageSwitcher: true,
    showThemeToggle: true,
    notifications: [],
  };

  return (
    <AppLayout config={config}>
      <div className={isSpecialPage ? "-m-4 p-0 scrollbar-hide" : ""}>
        <AppRouter />
      </div>
    </AppLayout>
  );
}
