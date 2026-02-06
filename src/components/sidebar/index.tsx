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
    <div className={`bg-[#0F123F] min-h-screen duration-500 sm:flex flex-col justify-between ${isOpen ? "md:w-[17rem] w-16" : "w-16"} text-gray-100 px-4`}>
      <div>
        <SidebarHeader />
        <SidebarSearch isOpen={isOpen} />
        <SidebarMenu menus={menus} isOpen={isOpen} />
      </div>
      <SidebarFooter isOpen={isOpen} />
    </div>
  );
}
