import { useNavigate } from "react-router-dom";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@kwim/shared-ui";
import profileImg from "../../assets/img/users/avatar.png";

export default function SidebarFooter({ isOpen }: { isOpen: boolean }) {
  const navigate = useNavigate();

  const displayName = "HR User";
  const email = "hr@kwimsoft.com";
  const avatar = (
    <img
      src={profileImg}
      alt=""
      className="rounded-full w-9 h-9 object-cover border-2 border-[#90959e60]"
    />
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  if (!isOpen) {
    return (
      <div className="flex justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-[#90959e60] p-0.5">
              {avatar}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="right" className="w-56 bg-[#0F123F] border-[#90959e60] text-gray-100">
            <DropdownMenuLabel className="text-gray-300 font-normal">
              <p className="font-medium text-white truncate">{displayName}</p>
              <p className="text-xs text-gray-400 truncate">{email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#90959e40]" />
            <DropdownMenuItem
              className="focus:bg-[#90959e30] focus:text-white cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              className="focus:bg-[#90959e30] focus:text-white cursor-pointer"
              onClick={() => navigate("/settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#90959e40]" />
            <DropdownMenuItem
              className="focus:bg-red-900/40 focus:text-red-200 text-red-200 cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-full flex items-center justify-between gap-2 bg-[#0F123F] hover:bg-[#151a4a] rounded-lg border border-[#90959e60] px-3 py-2.5 text-left focus:outline-none focus:ring-2 focus:ring-[#90959e60] transition-colors">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {avatar}
            <div className="min-w-0 flex-1">
              <p className="font-medium text-white text-sm truncate">{displayName}</p>
              <p className="text-[0.7rem] text-[#b5bbc5] truncate">{email}</p>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-[#b5bbc5] shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="top" className="w-56 bg-[#0F123F] border-[#90959e60] text-gray-100">
        <DropdownMenuLabel className="text-gray-300 font-normal">
          <p className="font-medium text-white truncate">{displayName}</p>
          <p className="text-xs text-gray-400 truncate">{email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[#90959e40]" />
        <DropdownMenuItem
          className="focus:bg-[#90959e30] focus:text-white cursor-pointer"
          onClick={() => navigate("/profile")}
        >
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          className="focus:bg-[#90959e30] focus:text-white cursor-pointer"
          onClick={() => navigate("/settings")}
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-[#90959e40]" />
        <DropdownMenuItem
          className="focus:bg-red-900/40 focus:text-red-200 text-red-200 cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
