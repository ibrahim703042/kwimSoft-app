import React, { ReactNode } from "react";
import Sidebar from "../sidebar";
import Topbar from "../topbar";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "../Breadcrumbs";

type AppLayoutProps = {
  children: ReactNode;
};

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();

  const isTrajetPage =
    location.pathname.startsWith("/trajet") ||
    location.pathname.startsWith("/administration/map-detail");

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

        <main className="flex-1 bg-gray-50 p-4 overflow-y-auto rounded-md shadow-sm transition-colors duration-300">
          {children}
        </main>
      </div>

    </div>
  );
};

export default AppLayout;
