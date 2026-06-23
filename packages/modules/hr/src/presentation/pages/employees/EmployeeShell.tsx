/**
 * EmployeeShell - Employee, Card Templates & Contracts Management Shell
 */
import { Users, CreditCard, FileText } from "lucide-react";
import { ModuleShell, ShellNavItem } from "@kwim/shared-ui";
import EmployeePage from "./EmployeePage";
import EmployeeCardTemplatePage from "./EmployeeCardTemplatePage";
import ContractPage from "../contracts/ContractPage";

const items: ShellNavItem[] = [
  { key: "employees", label: "EmployÃ©s", icon: Users, component: EmployeePage },
  { key: "card-template", label: "ModÃ¨le carte employÃ©", icon: CreditCard, component: EmployeeCardTemplatePage },
  { key: "contracts", label: "Contrats", icon: FileText, component: ContractPage },
];

export default function EmployeeShell() {
  return (
    <ModuleShell
      title="EmployÃ©s & Contrats"
      items={items}
      defaultSelected="employees"
      // enableSearch
    />
  );
}

