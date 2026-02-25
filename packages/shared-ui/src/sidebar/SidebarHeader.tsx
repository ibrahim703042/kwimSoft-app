import { IndentIncrease } from "lucide-react";

interface SidebarHeaderProps {
  isOpen: boolean;
  onToggle: () => void;
  logo?: React.ReactNode;
  title?: string;
}

export default function SidebarHeader({
  isOpen,
  onToggle,
  logo,
  title = "KwimSoft",
}: SidebarHeaderProps) {
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
              <div className="bg-[#b5bbc516] h-10 w-14 rounded-lg border-[#90959e96] border flex items-center justify-center">
                <span className="text-2xl">🚌</span>
              </div>
            )}
            {isOpen && <h1 className="text-[1.1rem]">{title}</h1>}
          </div>
        </div>
      </div>
      <div className="cursor-pointer md:block hidden">
        <IndentIncrease
          onClick={onToggle}
          className={`${isOpen ? "rotate-0" : "rotate-180"}`}
        />
      </div>
    </div>
  );
}
