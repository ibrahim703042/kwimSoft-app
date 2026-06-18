import React, { ReactNode } from "react";
import Sidebar from "../sidebar";
import Topbar from "../topbar";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "../Breadcrumbs";

type AppLayoutProps = {
  children: ReactNode;
};

const AUTH_PATHS = new Set(["/login", "/update-password"]);

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const isAuthPage = AUTH_PATHS.has(location.pathname);

  const isTrajetPage =
    location.pathname.startsWith("/trajet") ||
    location.pathname.startsWith("/operations/map");

  if (isAuthPage) {
    return (
      <main className="min-h-screen bg-background" aria-label="Main content">
        {children}
      </main>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        {!isTrajetPage && (
          <div className="mb-1 p-4">
            <Breadcrumbs />
          </div>
        )}

        <main
          className="flex-1 bg-muted/40 p-4 overflow-y-auto rounded-md shadow-sm transition-colors duration-300"
          aria-label="Main content"
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
