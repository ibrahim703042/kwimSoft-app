/**
 * Unified HR & People Management Module
 * Domain package: @kwim/modules-hr — presentation shells remain in admin.
 */
import { createHrModule } from "@kwim/modules-hr";
import PageTitle from "@/components/utilitie/PageTitle";
import HrShell from "./HrShell";

export const hrModule = createHrModule({ PageTitle, HrShell });

export {
  employeeApi,
  departmentApi,
  positionApi,
  contractApi,
  leaveApi,
  attendanceApi,
  payrollApi,
  recruitmentApi,
  trainingApi,
  expenseApi,
  idCardTemplateApi,
  HR_PERMISSIONS,
} from "@kwim/modules-hr";
