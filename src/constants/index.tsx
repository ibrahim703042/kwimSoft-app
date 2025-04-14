import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import {
  BoxSeam,
  Tags,
  Truck,
  People,
  ClipboardCheck,
  CurrencyDollar,
  BagCheck,
  Boxes,
  Speedometer,
  CashStack,
  CalendarEvent,
  BarChart,
  Sliders2,
  PersonLinesFill,
  BoxArrowRight,
  PersonCircle,
} from "react-bootstrap-icons";

// Sidebar links
export const sidebarLinks = (t: (key: string) => string) => [
  { label: t("sidebar.dashboard"), path: "/", icon: <Speedometer /> },
  { label: t("sidebar.inventory"), path: "/inventory", icon: <Boxes /> },
  { label: t("sidebar.orders"), path: "/orders", icon: <BagCheck /> },
  { label: t("sidebar.customers"), path: "/customers", icon: <People /> },
  { label: t("sidebar.products"), path: "/products", icon: <BoxSeam /> },
  { label: t("sidebar.employees"), path: "/employees", icon: <ClipboardCheck /> },
  { label: t("sidebar.payroll"), path: "/payroll", icon: <CashStack /> },
  { label: t("sidebar.hr"), path: "/hr", icon: <CalendarEvent /> },
  { label: t("sidebar.reports"), path: "/reports", icon: <BarChart /> },
  { label: t("sidebar.settings"), path: "/settings", icon: <Sliders2 /> },
  { label: t("sidebar.users"), path: "/user-management", icon: <PersonLinesFill /> },
];

// Quick access links
export const rawQuickLinks = (t: (key: string) => string) => [
  { label: t("links.products"), path: "/products", icon: <BoxSeam /> },
  { label: t("links.categories"), path: "/categories", icon: <Tags /> },
  { label: t("links.suppliers"), path: "/suppliers", icon: <Truck /> },
  { label: t("links.customers"), path: "/customers", icon: <People /> },
  { label: t("links.employees"), path: "/employees", icon: <ClipboardCheck /> },
];

// Profile dropdown menu
export const profileMenu = (t: (key: string) => string) => [
  { label: t("profile.profile"), key: "profile", icon: <PersonCircle /> },
  { label: t("profile.settings"), key: "settings", icon: <Sliders2 /> },
  { label: t("profile.signOut"), key: "signOut", icon: <BoxArrowRight /> },
];

//Dashboard cards
export const rawDashboardCards = (t: (key: string) => string) => [
  {
    icon: <DollarSign className="w-8 h-8" />,
    value: 128750,
    label: t("dashboard.revenue"),
    prefix: "$",
    trend: 12.5,
  },
  {
    icon: <ShoppingCart className="w-8 h-8" />,
    value: 856,
    label: t("dashboard.orders"),
    trend: 8.2,
  },
  {
    icon: <Package className="w-8 h-8" />,
    value: 1250,
    label: t("dashboard.inventory"),
    trend: -2.4,
  },
  {
    icon: <Users className="w-8 h-8" />,
    value: 142,
    label: t("dashboard.employees"),
    trend: 4.7,
  },
];