import React from "react";
import { PanelLeftClose } from "lucide-react";
import { useSidebarStore } from "../../stores/useSidebarStore";

interface SidebarHeaderProps {
  logo?: React.ReactNode;
  title?: string;
}

export default function SidebarHeader({
  logo,
  title = "KwimSoft",
}: SidebarHeaderProps) {
  const { isOpen, toggleSidebar } = useSidebarStore();

  return (
    <div
      className={`pt-0 flex items-center mb-5 ${
        isOpen ? "justify-between" : "flex flex-col-reverse pt-1"
      }`}
    >
      <div className="justify-center mt-3 mb-0">
        <div className="text-white font-medium text-sm px-2">
          <div className="flex items-center space-x-3">
            {logo || (
              <div className="bg-[#b5bbc516] dark:bg-gray-800 h-10 w-14 rounded-lg border-[#90959e96] dark:border-gray-700 border flex items-center justify-center">
                <span className="text-2xl">K</span>
              </div>
            )}
            {isOpen && <h1 className="text-[1.1rem]">{title}</h1>}
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={() => {
          console.log("Toggle clicked, current isOpen:", isOpen);
          toggleSidebar();
        }}
        className="cursor-pointer p-1 rounded hover:bg-white/10 transition-colors"
        aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
        <PanelLeftClose
          size={20}
          className={`text-white transition-transform duration-200 ${isOpen ? "rotate-0" : "rotate-180"}`}
        />
      </button>
    </div>
  );
}

export { SidebarHeader };
