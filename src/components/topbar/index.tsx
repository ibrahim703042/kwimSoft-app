import React from 'react';
import MenuButton from './menuButton';
import NotificationDropdown from './notificationDropdown ';
import UserDropdown from './userDropdown';

type TopBarProps = {
  onMenuClick: () => void;
};

const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <MenuButton onMenuClick={onMenuClick} />
          <h1 className="ml-2 text-xl font-medium text-primary md:hidden">E-Commerce SaaS</h1>
        </div>

        <div className="flex items-center">
          <NotificationDropdown />
          <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default TopBar;
