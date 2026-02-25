import { MenuItem } from "../types/module";
import SidebarHeader from "./SidebarHeader";
import SidebarSearch from "./SidebarSearch";
import SidebarMenu from "./SidebarMenu";
import SidebarFooter from "./SidebarFooter";

interface SidebarProps {
  menus?: MenuItem[];
  isOpen?: boolean;
  onToggle?: () => void;
  currentPath?: string;
  logo?: React.ReactNode;
  title?: string;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
  user?: any;
  onLogout?: () => void;
  onProfile?: () => void;
  onSettings?: () => void;
  avatarPlaceholder?: string;
  LinkComponent?: React.ComponentType<any>;
}

/**
 * Reusable Sidebar component for all module apps
 * Can be customized per app via props
 */
export function Sidebar({
  menus = [],
  isOpen = true,
  onToggle = () => {},
  currentPath = "",
  logo,
  title,
  showSearch = true,
  onSearch,
  user,
  onLogout,
  onProfile,
  onSettings,
  avatarPlaceholder,
  LinkComponent,
}: SidebarProps) {
  return (
    <div
      className={`bg-[#0F123F] h-screen duration-500 flex flex-col ${
        isOpen ? "md:w-[17rem] w-16" : "w-16"
      } text-gray-100 px-4 overflow-hidden`}
    >
      {/* Top: header + search — fixed */}
      <div className="shrink-0">
        <SidebarHeader isOpen={isOpen} onToggle={onToggle} logo={logo} title={title} />
        {showSearch && <SidebarSearch isOpen={isOpen} onSearch={onSearch} />}
      </div>

      {/* Middle: scrollable menu — scrollbar hidden */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden mt-2 scrollbar-hide">
        <SidebarMenu
          menus={menus}
          isOpen={isOpen}
          currentPath={currentPath}
          LinkComponent={LinkComponent}
        />
      </div>

      {/* Bottom: profile block — fixed to screen */}
      <div className="shrink-0 border-t border-[#90959e40] pt-3 pb-3 mt-auto">
        <SidebarFooter
          isOpen={isOpen}
          user={user}
          onLogout={onLogout}
          onProfile={onProfile}
          onSettings={onSettings}
          avatarPlaceholder={avatarPlaceholder}
        />
      </div>
    </div>
  );
}
