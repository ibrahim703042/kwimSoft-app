import { User, ChevronDown } from "lucide-react";
import { useSidebarStore } from "../../stores/useSidebarStore";

interface UserData {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  avatar?: string;
}

interface SidebarFooterProps {
  user?: UserData;
  onLogout?: () => void;
  onProfile?: () => void;
  onSettings?: () => void;
  avatarPlaceholder?: string;
}

export default function SidebarFooter({
  user,
  onLogout: _onLogout,
  onProfile: _onProfile,
  onSettings: _onSettings,
  avatarPlaceholder,
}: SidebarFooterProps) {
  void _onLogout;
  void _onProfile;
  void _onSettings;
  const { isOpen } = useSidebarStore();

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
    <div className="rounded-full w-9 h-9 bg-[#90959e60] dark:bg-gray-700 flex items-center justify-center border-2 border-[#90959e60] dark:border-gray-600">
      <User size={20} className="text-white dark:text-gray-300" />
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
      <button className="w-full flex items-center justify-between gap-2 bg-[#0F123F] dark:bg-gray-900 hover:bg-[#151a4a] dark:hover:bg-gray-800 rounded-lg border border-[#90959e96] dark:border-gray-700 px-3 py-2.5 text-left focus:outline-none focus:ring-2 focus:ring-[#90959e60] dark:focus:ring-gray-600 transition-colors">
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
