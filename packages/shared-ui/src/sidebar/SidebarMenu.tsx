import SidebarMenuItem from "./SidebarMenuItem";
import { MenuItem } from "../types/module";

interface SidebarMenuProps {
  menus: MenuItem[];
  isOpen: boolean;
  currentPath?: string;
  LinkComponent?: React.ComponentType<any>;
}

/**
 * Renders all registered module menus. Items are shown regardless of permission
 * so users see the full app structure (Odoo/QuickBooks style). Route-level
 * protection still enforces access when a page is opened.
 */
export default function SidebarMenu({
  menus,
  isOpen,
  currentPath,
  LinkComponent,
}: SidebarMenuProps) {
  return (
    <div className="mt-4 flex flex-col gap-4 relative">
      {menus.map((menu, index) => (
        <SidebarMenuItem
          key={menu.id}
          item={menu}
          isOpen={isOpen}
          index={index}
          currentPath={currentPath}
          LinkComponent={LinkComponent}
        />
      ))}
    </div>
  );
}
