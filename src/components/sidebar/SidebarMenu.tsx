import SidebarMenuItem from "./SidebarMenuItem";

export default function SidebarMenu({ menus, isOpen }: { menus: any[]; isOpen: boolean }) {
  return (
    <div className="mt-4 flex flex-col gap-4 relative">
      {menus.map((menu, index) => (
        <SidebarMenuItem key={menu.path} item={menu} isOpen={isOpen} index={index} />
      ))}
    </div>
  );
}
