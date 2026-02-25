import SidebarMenuItem from "./SidebarMenuItem";
import { MenuItem } from "../../types/module";
import { useSidebarStore } from "../../stores/useSidebarStore";

interface SidebarMenuProps {
  menus: MenuItem[];
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
  currentPath,
  LinkComponent,
}: SidebarMenuProps) {
  const { isOpen } = useSidebarStore();

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
