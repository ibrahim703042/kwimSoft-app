import {
  LayoutDashboard,
  Factory,
  FileStack,
  Wrench,
  Settings2,
  ClipboardCheck,
} from "lucide-react";
import { BaseMenuItem } from "../types/module";

export const manufacturingMenuItems: BaseMenuItem[] = [
  { key: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { key: "manufacturing-orders", label: "Ordres de fabrication", icon: Factory },
  { key: "bom", label: "Nomenclatures (BOM)", icon: FileStack },
  { key: "work-centers", label: "Postes de travail", icon: Wrench },
  { key: "operations", label: "Opérations", icon: Settings2 },
  { key: "quality-checks", label: "Contrôles qualité", icon: ClipboardCheck },
];

export const manufacturingModuleInfo = {
  name: "manufacturing",
  displayName: "Fabrication",
  title: "Fabrication",
  breadcrumbPath: "/manufacturing",
};
