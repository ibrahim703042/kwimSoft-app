import { MenuItem } from "@/app/ModuleRegistry";
import { LayoutGrid } from "lucide-react";

export const menu: MenuItem[] = [
  {
    id: "admin-area",
    label: "Console",
    path: "/console",
    icon: LayoutGrid,
  },
];
