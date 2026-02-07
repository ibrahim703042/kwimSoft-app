import { useLocation } from "react-router-dom";
import { useAuthStore } from "@/core/auth";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import { AppRouter } from "./Router";
import { getAllMenus } from "./registerModules";

/**
 * Main application shell
 * Replaces the old AppLayout component
 */
export function AppShell() {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const menus = getAllMenus();

  // Check if current page needs special layout (no padding)
  const isSpecialPage =
    location.pathname.startsWith("/trajet") ||
    location.pathname.startsWith("/administration/map-detail");

  // Check if current route is an auth route
  const isAuthRoute = ["/login", "/forgot-password", "/update-password"].includes(location.pathname);

  // For auth routes, show only the router without shell
  if (isAuthRoute || !isAuthenticated) {
    return <AppRouter />;
  }

  // For authenticated users, show full shell
  return (
    <div className="flex h-screen bg-white text-gray-800 dark:bg-[#0F123F] dark:text-gray-100">
      {/* Sidebar */}
      <div className="border-r border-gray-200 dark:border-gray-700">
        <Sidebar menus={menus} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-[#101530] transition-colors duration-300">
        {/* Header/Navbar */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <Navbar />
        </div>

        {/* Content Area */}
        <div
          className={`flex-1 overflow-y-auto ${isSpecialPage ? "p-0" : "p-4"}`}
        >
          {/* Router renders page content */}
          <AppRouter />
        </div>
      </div>
    </div>
  );
}
