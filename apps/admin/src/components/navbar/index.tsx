import React from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import UserInfo from "./UserInfo";
import ThemeToggle from "./ThemeToggle";
import GlobalSearch from "./GlobalSearch";

const Navbar: React.FC = () => {
  return (
    <div className="flex justify-between items-center px-5 bg-white dark:bg-gray-900 h-14 rounded-md relative shadow-sm">
      <GlobalSearch />
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <LanguageSwitcher />
        <UserInfo />
      </div>
    </div>
  );
};

export default Navbar;
