import React from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import GlobalSearch from "./GlobalSearch";
import UserDropdown from "./userDropdown";

const Topbar: React.FC = () => {
  return (
    <div className="relative flex h-14 items-center justify-between rounded-md bg-white px-5 shadow-sm dark:bg-gray-900">
      <GlobalSearch />
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <LanguageSwitcher />
        <UserDropdown />
      </div>
    </div>
  );
};

export default Topbar;
