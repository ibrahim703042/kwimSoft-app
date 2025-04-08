import React, { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();

  const isTrajetPage =
    location.pathname.startsWith("/trajet") ||
    location.pathname.startsWith("/administration/map-detail");

  return (
    <div className="flex h-screen bg-white text-gray-800 dark:bg-[#0F123F] dark:text-gray-100">
      {/* Sidebar */}
      <div className="border-r border-gray-200 dark:border-gray-700">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-[#101530] transition-colors duration-300">
        {/* Header/Navbar */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <Navbar />
        </div>

        {/* Content Area */}
        <div
          className={`flex-1 overflow-y-auto ${isTrajetPage ? "p-0" : "p-4"}`}
        >
          {/* Breadcrumbs */}
          {!isTrajetPage && (
            <div className="mb-2">
              <Breadcrumb />
            </div>
          )}

          {/* Children */}
          <div className="bg-white dark:bg-[#1A1F3B] p-4 rounded-md shadow-sm transition-colors duration-300">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
