import { useNavigate } from "react-router-dom";
import { User, Settings, Shield, CreditCard } from "lucide-react";
import { UserDropdown as SharedUserDropdown, type UserMenuItem } from "@kwim/shared-ui";
import profile from "../../assets/img/users/avatar.png";

const UserDropdown = () => {
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
        fullName: "HR User",
        email: "hr@kwimsoft.com",
        role: "HR Manager",
        avatar: profile,
      }}
      menuItems={menuItems}
      onLogout={handleLogout}
      onHelp={() => navigate("/help")}
    />
  );
};

export default UserDropdown;
