import React from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import GlobalSearch from "./GlobalSearch";
import NotificationDropdown from "./NotificationDropdown";
import UserDropdown from "./UserDropdown";
import QuickActions from "./QuickActions";
import Breadcrumbs from "./Breadcrumbs";

const Navbar: React.FC = () => {
  return (
    <div className="flex flex-col gap-0">
      <div className="flex justify-between items-center px-4 sm:px-5 bg-white dark:bg-gray-900 h-14 rounded-lg shadow-sm border border-border/40">
        <div className="flex items-center gap-4">
          <Breadcrumbs />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <GlobalSearch />

          <div className="hidden sm:block h-6 w-px bg-border" />

          <QuickActions />

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <LanguageSwitcher />
            <NotificationDropdown />
          </div>

          <div className="h-6 w-px bg-border" />

          <UserDropdown />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
