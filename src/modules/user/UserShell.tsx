/**
 * UserShell — Same structure as HrShell
 *
 * Single entry "Gestion Utilisateurs" shows UserTabbedView
 * (Utilisateurs | Groupes | Rôles | Sessions as tabs).
 */
import { LayoutGrid } from "lucide-react";
import { ModuleShell, ShellNavItem } from "@/core/ui";
import UserTabbedView from "./UserTabbedView";

const items: ShellNavItem[] = [
  {
    key: "user-tabs",
    label: "Gestion Utilisateurs",
    icon: LayoutGrid,
    component: UserTabbedView,
  },
];

export default function UserShell() {
  return (
    <ModuleShell
      title="Utilisateurs & Accès"
      breadcrumbPath="/user"
      items={items}
      defaultSelected="user-tabs"
      enableSearch
    />
  );
}
