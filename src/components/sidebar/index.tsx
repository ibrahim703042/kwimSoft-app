import SidebarHeader from "./SidebarHeader";
import SidebarSearch from "./SidebarSearch";
import SidebarMenu from "./SidebarMenu";
import SidebarFooter from "./SidebarFooter";
import { useSidebarStore } from "../../store/selectors/useSidebarStore";
import { MenuItem } from "@/app/ModuleRegistry";

interface SidebarProps {
  menus?: MenuItem[];
}

export default function Sidebar({ menus = [] }: SidebarProps) {
  const { isOpen } = useSidebarStore();

  return (
    <div
      className={`bg-[#0F123F] h-screen duration-500 flex flex-col ${isOpen ? "md:w-[17rem] w-16" : "w-16"} text-gray-100 px-4 overflow-hidden`}
    >
      {/* Top: header + search — fixed */}
      <div className="shrink-0">
        <SidebarHeader />
        <SidebarSearch isOpen={isOpen} />
      </div>

      {/* Middle: scrollable menu */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden mt-2">
        <SidebarMenu menus={menus} isOpen={isOpen} />
      </div>

      {/* Bottom: profile block — fixed to screen */}
      <div className="shrink-0 border-t border-[#90959e40] pt-3 pb-3 mt-auto">
        <SidebarFooter isOpen={isOpen} />
      </div>
    </div>
  );
}
