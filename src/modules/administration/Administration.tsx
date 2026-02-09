import { Car, Combine, Users } from "lucide-react";
import { ModuleShell, ShellNavItem } from "@/core/ui";
import Driver from "@/modules/transports/driver/Driver";
import Gare from "@/modules/transports/gare/Gare";

// Stub bus component — full vehicle management will be in the Transport module
const BusPage = () => (
  <div className="p-4">
    <h2 className="text-lg font-semibold">Bus</h2>
    <p className="text-muted-foreground mt-2">
      Bus fleet management. Full vehicle features are available in the Transport module.
    </p>
  </div>
);

const items: ShellNavItem[] = [
  { key: "staff",   label: "Staff",   icon: Users,   component: Driver },
  { key: "bus",     label: "Bus",     icon: Car,     component: BusPage },
  { key: "station", label: "Station", icon: Combine, component: Gare },
];

export default function Administration() {
  return (
    <ModuleShell
      title="Administration"
      breadcrumbPath="/administration"
      items={items}
      enableSearch
    />
  );
}
