/**
 * EmployeeShell - Employee, Card Templates & Contracts Management Shell
 */
import { Users, CreditCard, FileText } from "lucide-react";
import { ModuleShell, ShellNavItem } from "@kwim/shared-ui";
import EmployeePage from "./EmployeePage";
import EmployeeCardTemplatePage from "./EmployeeCardTemplatePage";
import ContractPage from "../contracts/ContractPage";

const items: ShellNavItem[] = [
  { key: "employees", label: "Employés", icon: Users, component: EmployeePage },
  { key: "card-template", label: "Modèle carte employé", icon: CreditCard, component: EmployeeCardTemplatePage },
  { key: "contracts", label: "Contrats", icon: FileText, component: ContractPage },
];

export default function EmployeeShell() {
  return (
    <ModuleShell
      title="Employés & Contrats"
      items={items}
      defaultSelected="employees"
      // enableSearch
    />
  );
}
