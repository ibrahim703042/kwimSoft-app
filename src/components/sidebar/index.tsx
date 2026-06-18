import SidebarHeader from "./SidebarHeader";
import SidebarSearch from "./SidebarSearch";
import SidebarMenu from "./SidebarMenu";
import SidebarFooter from "./SidebarFooter";
import { useSidebarStore } from "../../store/selectors/useSidebarStore";
import {
  LayoutDashboard,
  SlidersHorizontal,
  Users,
  Package,
  UserRound,
  Building2,
  Clock,
  KeyRound,
  Monitor,
  ShieldCheck,
  ScrollText,
  ClipboardCheck,
  FileText,
  Layers,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Sidebar() {
  const { isOpen } = useSidebarStore();
  const { t } = useTranslation();

  const menus = [
    { title: t("sidebar.dashboard"), path: "/", icon: <LayoutDashboard className="h-4 w-4" /> },
    { title: t("sidebar.inventory"), path: "/inventory", icon: <Package className="h-4 w-4" /> },
    { title: t("sidebar.customers"), path: "/customers", icon: <UserRound className="h-4 w-4" /> },
    { title: t("sidebar.operations"), path: "/operations", icon: <Building2 className="h-4 w-4" /> },
    { title: t("sidebar.horaires"), path: "/horaires", icon: <Clock className="h-4 w-4" /> },
    { title: t("sidebar.settings"), path: "/settings", icon: <SlidersHorizontal className="h-4 w-4" /> },
    {
      title: t("sidebar.userManagement"),
      section: true,
      gap: true,
    },
    {
      title: t("sidebar.iamDashboard"),
      path: "/user-management/dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      title: t("sidebar.iamUsers"),
      path: "/user-management/users",
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: t("sidebar.iamFunctions"),
      path: "/user-management/functions",
      icon: <Layers className="h-4 w-4" />,
    },
    {
      title: t("sidebar.iamPermissions"),
      path: "/user-management/permissions",
      icon: <KeyRound className="h-4 w-4" />,
    },
    {
      title: t("sidebar.iamSessions"),
      path: "/user-management/sessions",
      icon: <Monitor className="h-4 w-4" />,
    },
    {
      title: t("sidebar.iamMfa"),
      path: "/user-management/mfa",
      icon: <ShieldCheck className="h-4 w-4" />,
    },
    {
      title: t("sidebar.iamAudit"),
      path: "/user-management/audit",
      icon: <ScrollText className="h-4 w-4" />,
    },
    {
      title: t("sidebar.iamAccessReviews"),
      path: "/user-management/access-reviews",
      icon: <ClipboardCheck className="h-4 w-4" />,
    },
    {
      title: t("sidebar.iamPolicies"),
      path: "/user-management/policies",
      icon: <FileText className="h-4 w-4" />,
    },
  ];

  return (
    <div
      className={`bg-sidebar min-h-screen duration-500 sm:flex flex-col justify-between ${
        isOpen ? "md:w-[17rem] w-16" : "w-16"
      } text-sidebar-foreground px-4`}
    >
      <div>
        <SidebarHeader />
        <SidebarSearch isOpen={isOpen} />
        <SidebarMenu menus={menus} isOpen={isOpen} />
      </div>
      <SidebarFooter isOpen={isOpen} />
    </div>
  );
}
