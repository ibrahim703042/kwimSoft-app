import SidebarHeader from "./SidebarHeader";
import SidebarSearch from "./SidebarSearch";
import SidebarMenu from "./SidebarMenu";
import SidebarFooter from "./SidebarFooter";
import { useSidebarStore } from "../../store/selectors/useSidebarStore";
import {
  Speedometer,
  Sliders2,
  PersonLinesFill,
  Boxes,
  BagCheck,
  People,
  BoxSeam,
  CashStack,
  BarChart,
  ClipboardCheck,
  CalendarEvent,
} from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";

export default function Sidebar() {
  const { isOpen } = useSidebarStore();
  const { t } = useTranslation();

  const menus = [
    { title: t("sidebar.dashboard"), path: "/", icon: <Speedometer /> },
    { title: t("sidebar.inventory"), path: "/inventory", icon: <Boxes /> },
    { title: t("sidebar.orders"), path: "/orders", icon: <BagCheck /> },
    { title: t("sidebar.customers"), path: "/customers", icon: <People /> },
    { title: t("sidebar.products"), path: "/products", icon: <BoxSeam /> },
    {
      title: t("sidebar.employees"),
      path: "/employees",
      icon: <ClipboardCheck />,
    },
    { title: t("sidebar.payroll"), path: "/payroll", icon: <CashStack /> },
    { title: t("sidebar.hr"), path: "/hr", icon: <CalendarEvent /> },
    { title: t("sidebar.reports"), path: "/reports", icon: <BarChart /> },
    { title: t("sidebar.settings"), path: "/settings", icon: <Sliders2 /> },
    {
      title: t("sidebar.users"),
      path: "/user-management",
      icon: <PersonLinesFill />,
    },
  ];

  return (
    <div
      className={`bg-[#0F123F] min-h-screen duration-500 sm:flex flex-col justify-between ${
        isOpen ? "md:w-[17rem] w-16" : "w-16"
      } text-gray-100 px-4`}
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
