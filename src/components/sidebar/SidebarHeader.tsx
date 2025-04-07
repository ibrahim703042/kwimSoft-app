import { IndentIncrease } from "lucide-react";
import bus from "../../assets/img/utils/bus.png";
import { useSidebarStore } from "../../store/selectors/useSidebarStore";

export default function SidebarHeader() {
  const { isOpen, toggleSidebar } = useSidebarStore();

  return (
    <div className={`pt-0 flex items-center mb-5 ${isOpen ? "justify-between" : "flex flex-col-reverse pt-1"}`}>
      <div className="justify-center mt-3 mb-0">
        <div className="text-white font-medium text-sm px-2">
          <div className="flex items-center space-x-3">
            <div className="bg-[#b5bbc516] h-10 w-14 rounded-lg border-[#90959e96] border">
              <img src={bus} alt="" className="p-1" />
            </div>
            {isOpen && <h1 className="text-[1.1rem]">KwimSoft</h1>}
          </div>
        </div>
      </div>
      <div className="cursor-pointer md:block hidden">
        <IndentIncrease
          onClick={toggleSidebar}
          className={`${isOpen ? "rotate-0" : "rotate-180"}`}
        />
      </div>
    </div>
  );
}
