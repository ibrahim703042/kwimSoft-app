import React from "react";
import {
  User,
  Settings,
  HelpCircle,
  LogOut,
  Shield,
  CreditCard,
  Activity,
  ChevronRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "../ui/dropdown-menu";

export interface UserData {
  fullName?: string;
  email?: string;
  role?: string;
  avatar?: string;
}

export interface UserMenuItem {
  icon: React.ElementType;
  label: string;
  description?: string;
  onClick: () => void;
}

interface UserDropdownProps {
  user?: UserData;
  menuItems?: UserMenuItem[];
  onLogout?: () => void;
  onHelp?: () => void;
}

const defaultMenuItems: UserMenuItem[] = [
  {
    icon: User,
    label: "My Profile",
    description: "View and edit profile",
    onClick: () => console.log("Profile"),
  },
  {
    icon: Settings,
    label: "Settings",
    description: "Account settings",
    onClick: () => console.log("Settings"),
  },
  {
    icon: Shield,
    label: "Security",
    description: "Password & 2FA",
    onClick: () => console.log("Security"),
  },
  {
    icon: CreditCard,
    label: "Billing",
    description: "Plans & invoices",
    onClick: () => console.log("Billing"),
  },
];

const UserDropdown: React.FC<UserDropdownProps> = ({
  user,
  menuItems = defaultMenuItems,
  onLogout,
  onHelp,
}) => {
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
        <button className="flex items-center gap-2 p-1.5 pr-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20">
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
      <DropdownMenuContent align="end" className="w-72 p-0">
        <div className="px-4 py-3 bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border">
          <div className="flex items-center gap-3">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="User"
                className="h-12 w-12 rounded-full border-2 border-white shadow-md"
              />
            ) : (
              <div className="h-12 w-12 rounded-full border-2 border-white shadow-md bg-muted flex items-center justify-center">
                <User size={24} className="text-muted-foreground" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {user?.fullName || "User Name"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email || "user@example.com"}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-primary/20 text-primary">
                  {user?.role || "Member"}
                </span>
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  <Activity size={8} />
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        <DropdownMenuGroup className="p-1">
          {menuItems.map((item) => (
            <DropdownMenuItem
              key={item.label}
              onClick={item.onClick}
              className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-md"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted">
                <item.icon size={16} className="text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{item.label}</p>
                {item.description && (
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                )}
              </div>
              <ChevronRight size={14} className="text-muted-foreground" />
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="m-0" />

        <DropdownMenuGroup className="p-1">
          <DropdownMenuItem
            onClick={onHelp}
            className="flex items-center gap-3 px-3 py-2 cursor-pointer rounded-md"
          >
            <HelpCircle size={16} className="text-muted-foreground" />
            <span className="text-sm">Help & Support</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="m-0" />

        <div className="p-1">
          <DropdownMenuItem
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 focus:bg-red-50 dark:focus:bg-red-900/20"
          >
            <LogOut size={16} />
            <span className="text-sm font-medium">Sign out</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
