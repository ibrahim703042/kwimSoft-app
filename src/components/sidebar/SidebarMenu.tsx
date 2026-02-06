import SidebarMenuItem from "./SidebarMenuItem";
import { Can } from "@/core/auth";
import { MenuItem } from "@/app/ModuleRegistry";

interface SidebarMenuProps {
  menus: MenuItem[];
  isOpen: boolean;
}

export default function SidebarMenu({ menus, isOpen }: SidebarMenuProps) {
  return (
    <div className="mt-4 flex flex-col gap-4 relative">
      {menus.map((menu, index) => (
        <Can key={menu.id} permission={menu.permission}>
          <SidebarMenuItem item={menu} isOpen={isOpen} index={index} />
        </Can>
      ))}
    </div>
  );
}
