import SidebarMenuItem from "./SidebarMenuItem";
import { MenuItem } from "@kwim/shared-ui";

interface SidebarMenuProps {
  menus: MenuItem[];
  isOpen: boolean;
}

export default function SidebarMenu({ menus, isOpen }: SidebarMenuProps) {
  return (
    <div className="mt-4 flex flex-col gap-4 relative">
      {menus.map((menu, index) => (
        <SidebarMenuItem key={menu.id} item={menu} isOpen={isOpen} index={index} />
      ))}
    </div>
  );
}
