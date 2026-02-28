import React, { ReactNode, useState } from "react";
import { PanelLeftClose, ChevronDown, ChevronRight, User, Settings, LogOut } from "lucide-react";
import { useSidebarStore } from "../stores/useSidebarStore";
import { MenuItem } from "../types/module";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

interface LayoutSidebarProps {
  appName: string;
  logo?: ReactNode;
  menus: MenuItem[];
  user?: {
    fullName?: string;
    email?: string;
    role?: string;
    avatar?: string;
  };
  onLogout?: () => void;
  onProfile?: () => void;
  onSettings?: () => void;
  onSearch?: (query: string) => void;
  showSearch?: boolean;
  isOpen: boolean;
  LinkComponent?: React.ComponentType<{ to: string; className?: string; children: ReactNode }>;
}

export function LayoutSidebar({
  appName,
  logo,
  menus,
  user,
  onLogout,
  onProfile,
  onSettings,
  showSearch = true,
  isOpen,
  LinkComponent,
}: LayoutSidebarProps) {
  const { toggleSidebar } = useSidebarStore();

  return (
    <div
      className={`bg-[#0F123F] dark:bg-gray-900 h-screen duration-500 flex flex-col ${isOpen ? "md:w-[17rem] w-16" : "w-16"
        } text-gray-100 dark:text-gray-200 px-4 overflow-hidden`}
    >
      {/* Header */}
      <div className="shrink-0">
        <SidebarHeader
          appName={appName}
          logo={logo}
          isOpen={isOpen}
          onToggle={toggleSidebar}
        />
        {showSearch && <SidebarSearch isOpen={isOpen} />}
      </div>

      {/* Menu */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden mt-2 scrollbar-hide">
        <div className="mt-4 flex flex-col gap-4 relative">
          {menus.map((menu, index) => (
            <SidebarMenuItem
              key={menu.id}
              item={menu}
              isOpen={isOpen}
              index={index}
              LinkComponent={LinkComponent}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-[#90959e40] pt-3 pb-3 mt-auto">
        <SidebarFooter
          user={user}
          isOpen={isOpen}
          onLogout={onLogout}
          onProfile={onProfile}
          onSettings={onSettings}
        />
      </div>
    </div>
  );
}

function SidebarHeader({
  appName,
  logo,
  isOpen,
  onToggle,
}: {
  appName: string;
  logo?: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`pt-0 flex items-center mb-5 ${isOpen ? "justify-between" : "flex flex-col-reverse pt-1"
        }`}
    >
      <div className="justify-center mt-3 mb-0">
        <div className="text-white font-medium text-sm px-2">
          <div className="flex items-center space-x-3">
            {logo || (
              <div className="bg-[#b5bbc516] dark:bg-gray-800 h-10 w-14 rounded-lg border-[#90959e96] dark:border-gray-700 border flex items-center justify-center">
                <span className="text-2xl font-bold">K</span>
              </div>
            )}
            {isOpen && <h1 className="text-[1.1rem]">{appName}</h1>}
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className="cursor-pointer p-1 rounded hover:bg-white/10 transition-colors"
        aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
        <PanelLeftClose
          size={20}
          className={`text-white transition-transform duration-200 ${isOpen ? "rotate-0" : "rotate-180"
            }`}
        />
      </button>
    </div>
  );
}

function SidebarSearch({ isOpen }: { isOpen: boolean }) {
  return isOpen ? (
    <div className="flex items-center space-x-2 mx-2 bg-[#b5bbc516] dark:bg-gray-800 px-3 py-[5px] rounded-md border-[#90959e96] dark:border-gray-700 border">
      <svg className="size-5" fill="#b5bbc5" viewBox="0 0 24 24">
        <path
          fill="#b5bbc5"
          d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
        />
      </svg>
      <input
        type="text"
        placeholder="Search"
        className="bg-transparent outline-none text-[#b5bbc5] text-[0.8rem] w-full"
      />
    </div>
  ) : (
    <div className="bg-[#b5bbc516] dark:bg-gray-800 border-[#90959e96] dark:border-gray-700 border flex justify-center items-center px-2 py-1 rounded-md">
      <svg className="size-6" fill="#b5bbc5" viewBox="0 0 24 24">
        <path
          fill="#b5bbc5"
          d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
        />
      </svg>
    </div>
  );
}

function SidebarMenuItem({
  item,
  isOpen,
  index,
  LinkComponent,
}: {
  item: MenuItem;
  isOpen: boolean;
  index: number;
  LinkComponent?: React.ComponentType<{ to: string; className?: string; children: ReactNode }>;
}) {
  const Icon = item.icon;
  const hasChildren = item.children && item.children.length > 0;
  const [expanded, setExpanded] = useState(false);

  const baseClasses = `group relative flex items-center text-sm gap-3.5 p-2 rounded-md ${item.gap ? "mt-0" : ""
    }`;
  const hoverClasses = "hover:text-white hover:bg-gradient-to-r hover:from-[rgba(32,61,148,1)] hover:to-[rgba(16,22,71,1)]";

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className={`w-full ${baseClasses} ${hoverClasses}`}
          title={!isOpen ? item.label : undefined}
        >
          <div>{Icon && <Icon size={18} />}</div>
          <span
            style={{ transitionDelay: `${index * 50}ms` }}
            className={`whitespace-pre text-[#f5f5f5de] duration-300 flex-1 text-left ${!isOpen && "opacity-0 translate-x-28 overflow-hidden"
              }`}
          >
            {item.label}
          </span>
          {isOpen && (
            <span className="text-gray-400 dark:text-gray-500">
              {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </span>
          )}
        </button>

        {expanded && isOpen && (
          <div className="ml-4 mt-1 space-y-0.5 border-l border-gray-600 pl-2">
            {item.children!.map((child) => {
              const childContent = (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                  {child.label}
                </>
              );
              const childClasses = "flex items-center text-xs gap-2 py-1.5 px-2 rounded-md transition-colors text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-200 hover:bg-[rgba(32,61,148,0.3)] dark:hover:bg-gray-800";

              if (LinkComponent) {
                return (
                  <LinkComponent key={child.id} to={child.path || "#"} className={childClasses}>
                    {childContent}
                  </LinkComponent>
                );
              }
              return (
                <a key={child.id} href={child.path || "#"} className={childClasses}>
                  {childContent}
                </a>
              );
            })}
          </div>
        )}
        {item.gap && <hr className="border-t border-gray-600 my-3" />}
      </div>
    );
  }

  const menuContent = (
    <>
      <div>{Icon && <Icon size={18} />}</div>
      <h2
        style={{ transitionDelay: `${index * 50}ms` }}
        className={`whitespace-pre text-[#f5f5f5de] duration-300 ${!isOpen && "opacity-0 translate-x-28 overflow-hidden"
          }`}
      >
        {item.label}
      </h2>
    </>
  );

  const className = `${baseClasses} ${hoverClasses}`;

  return (
    <>
      {LinkComponent ? (
        <LinkComponent to={item.path || "#"} className={className}>
          {menuContent}
        </LinkComponent>
      ) : (
        <a href={item.path || "#"} className={className} title={!isOpen ? item.label : undefined}>
          {menuContent}
        </a>
      )}
      {item.gap && <hr className="border-t border-gray-600 my-3" />}
    </>
  );
}

function SidebarFooter({
  user,
  isOpen,
  onLogout,
  onProfile,
  onSettings,
}: {
  user?: { fullName?: string; email?: string; avatar?: string };
  isOpen: boolean;
  onLogout?: () => void;
  onProfile?: () => void;
  onSettings?: () => void;
}) {
  const displayName = user?.fullName || "User";
  const email = user?.email || "";
  const avatar = user?.avatar ? (
    <img
      src={user.avatar}
      alt=""
      className="rounded-full w-9 h-9 object-cover border-2 border-[#90959e60]"
    />
  ) : (
    <div className="rounded-full w-9 h-9 bg-[#90959e60] dark:bg-gray-700 flex items-center justify-center border-2 border-[#90959e60] dark:border-gray-600">
      <User size={18} className="text-white dark:text-gray-300" />
    </div>
  );

  const menuContent = (
    <>
      <DropdownMenuLabel className="text-gray-300 dark:text-gray-400 font-normal">
        <p className="font-medium text-white dark:text-gray-200 truncate">{displayName}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{email}</p>
      </DropdownMenuLabel>
      <DropdownMenuSeparator className="bg-[#90959e40] dark:bg-gray-700" />
      <DropdownMenuItem
        className="focus:bg-[#90959e30] dark:focus:bg-gray-800 focus:text-white dark:focus:text-gray-200 cursor-pointer"
        onClick={onProfile}
      >
        <User className="mr-2 h-4 w-4" />
        Profile
      </DropdownMenuItem>
      <DropdownMenuItem
        className="focus:bg-[#90959e30] focus:text-white cursor-pointer"
        onClick={onSettings}
      >
        <Settings className="mr-2 h-4 w-4" />
        Settings
      </DropdownMenuItem>
      <DropdownMenuSeparator className="bg-[#90959e40]" />
      <DropdownMenuItem
        className="focus:bg-red-900/40 dark:focus:bg-red-900/30 focus:text-red-200 dark:focus:text-red-300 text-red-200 dark:text-red-300 cursor-pointer"
        onClick={onLogout}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </DropdownMenuItem>
    </>
  );

  if (!isOpen) {
    return (
      <div className="flex justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-[#90959e60] p-0.5">
              {avatar}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="right" className="w-56 bg-[#0F123F] dark:bg-gray-900 border-[#90959e60] dark:border-gray-700 text-gray-100 dark:text-gray-200">
            {menuContent}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-full flex items-center justify-between gap-2 bg-[#0F123F] dark:bg-gray-900 hover:bg-[#151a4a] dark:hover:bg-gray-800 rounded-lg border border-[#90959e60] dark:border-gray-700 px-3 py-2.5 text-left focus:outline-none focus:ring-2 focus:ring-[#90959e60] dark:focus:ring-gray-600 transition-colors">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {avatar}
            <div className="min-w-0 flex-1">
              <p className="font-medium text-white text-sm truncate">{displayName}</p>
              <p className="text-[0.7rem] text-[#b5bbc5] truncate">{email}</p>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-[#b5bbc5] shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="top" className="w-56 bg-[#0F123F] dark:bg-gray-900 border-[#90959e60] dark:border-gray-700 text-gray-100 dark:text-gray-200">
        {menuContent}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
