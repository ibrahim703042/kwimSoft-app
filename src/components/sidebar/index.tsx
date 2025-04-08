import SidebarHeader from "./SidebarHeader";
import SidebarSearch from "./SidebarSearch";
import SidebarMenu from "./SidebarMenu";
import SidebarFooter from "./SidebarFooter";
import { useSidebarStore } from "../../store/selectors/useSidebarStore";
import { Speedometer, Sliders2, PersonLinesFill } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";

export default function Sidebar() {
  const { isOpen } = useSidebarStore();
  const { t } = useTranslation();

  const menus = [
    { title: t("menu.dashboard"), path: "/", icon: <Speedometer /> },
    // { title: t("menu.schedules"), path: "/horaires", icon: <CalendarEvent /> },
    // { title: t("menu.ticket"), path: "/ticket", icon: <Wallet /> },
    // { title: t("menu.payments"), path: "/paiements", icon: <CashStack /> },
    // { title: t("menu.reservation"), path: "/reservation", icon: <JournalCheck /> },
    { title: t("menu.administration"), path: "/administration", icon: <Sliders2 /> },
    { title: "User Management", path: "/user-management", icon: <PersonLinesFill /> }
  ];

  return (
    <div className={`bg-[#0F123F] min-h-screen duration-500 sm:flex flex-col justify-between ${isOpen ? "md:w-[17rem] w-16" : "w-16"} text-gray-100 px-4`}>
      <div>
        <SidebarHeader />
        <SidebarSearch isOpen={isOpen} />
        <SidebarMenu menus={menus} isOpen={isOpen} />
      </div>
      <SidebarFooter isOpen={isOpen} />
    </div>
  );
}
