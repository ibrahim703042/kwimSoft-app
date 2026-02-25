import { User, Settings, LogOut, ChevronDown } from "lucide-react";

interface UserData {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  avatar?: string;
}

interface SidebarFooterProps {
  isOpen: boolean;
  user?: UserData;
  onLogout?: () => void;
  onProfile?: () => void;
  onSettings?: () => void;
  avatarPlaceholder?: string;
  DropdownComponent?: React.ComponentType<any>;
}

export default function SidebarFooter({
  isOpen,
  user,
  onLogout,
  onProfile,
  onSettings,
  avatarPlaceholder,
}: SidebarFooterProps) {
  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.username || "User";
  const email = user?.email || "";
  
  const avatar = user?.avatar ? (
    <img
      src={user.avatar}
      alt=""
      className="rounded-full w-9 h-9 object-cover border-2 border-[#90959e60]"
    />
  ) : avatarPlaceholder ? (
    <img
      src={avatarPlaceholder}
      alt=""
      className="rounded-full w-9 h-9 object-cover border-2 border-[#90959e60]"
    />
  ) : (
    <div className="rounded-full w-9 h-9 bg-[#90959e60] flex items-center justify-center border-2 border-[#90959e60]">
      <User size={20} className="text-white" />
    </div>
  );

  if (!isOpen) {
    return (
      <div className="flex justify-center">
        <button
          className="rounded-full focus:outline-none focus:ring-2 focus:ring-[#90959e60] p-0.5"
          title={displayName}
        >
          {avatar}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <button className="w-full flex items-center justify-between gap-2 bg-[#0F123F] hover:bg-[#151a4a] rounded-lg border border-[#90959e96] px-3 py-2.5 text-left focus:outline-none focus:ring-2 focus:ring-[#90959e60] transition-colors">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {avatar}
          <div className="min-w-0 flex-1">
            <p className="font-medium text-white text-sm truncate">{displayName}</p>
            <p className="text-[0.7rem] text-[#b5bbc5] truncate">{email}</p>
          </div>
        </div>
        <ChevronDown className="h-4 w-4 text-[#b5bbc5] shrink-0" />
      </button>
    </div>
  );
}
