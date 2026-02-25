import { Sidebar as SharedSidebar } from "@kwim/shared-ui";
import { useSidebarStore } from "../../store/selectors/useSidebarStore";
import { useAuthStore } from "@/core/auth";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { MenuItem } from "@/app/ModuleRegistry";
import bus from "../../assets/img/utils/bus.png";
import profileImg from "../../assets/img/users/avatar.png";

interface SidebarProps {
  menus?: MenuItem[];
}

/**
 * Admin app sidebar wrapper that uses the shared Sidebar component
 * Provides app-specific configuration and state management
 */
export default function Sidebar({ menus = [] }: SidebarProps) {
  const { isOpen, toggleSidebar } = useSidebarStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const logo = (
    <div className="bg-[#b5bbc516] h-10 w-14 rounded-lg border-[#90959e96] border">
      <img src={bus} alt="KwimSoft" className="p-1" />
    </div>
  );

  return (
    <SharedSidebar
      menus={menus}
      isOpen={isOpen}
      onToggle={toggleSidebar}
      currentPath={location.pathname}
      logo={logo}
      title="KwimSoft"
      showSearch={true}
      user={user}
      onLogout={handleLogout}
      onProfile={() => navigate("/profile")}
      onSettings={() => navigate("/settings")}
      avatarPlaceholder={profileImg}
      LinkComponent={NavLink}
    />
  );
}
