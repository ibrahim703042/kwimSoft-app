import { useNavigate } from "react-router-dom";
import { User, Settings, Shield, CreditCard } from "lucide-react";
import { UserDropdown as SharedUserDropdown, type UserMenuItem } from "@kwim/shared-ui";
import { useUserData } from "@/hooks/useUserData";
import profile from "@/assets/img/users/avatar.png";

const UserDropdown = () => {
  const { data } = useUserData();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const menuItems: UserMenuItem[] = [
    {
      icon: User,
      label: "My Profile",
      description: "View and edit profile",
      onClick: () => navigate("/profile"),
    },
    {
      icon: Settings,
      label: "Settings",
      description: "Account settings",
      onClick: () => navigate("/settings"),
    },
    {
      icon: Shield,
      label: "Security",
      description: "Password & 2FA",
      onClick: () => navigate("/security"),
    },
    {
      icon: CreditCard,
      label: "Billing",
      description: "Plans & invoices",
      onClick: () => navigate("/billing"),
    },
  ];

  return (
    <SharedUserDropdown
      user={{
        fullName: data?.fullName,
        email: data?.email,
        role: data?.role,
        avatar: profile,
      }}
      menuItems={menuItems}
      onLogout={handleLogout}
      onHelp={() => navigate("/help")}
    />
  );
};

export default UserDropdown;
