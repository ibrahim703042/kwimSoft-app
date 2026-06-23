/**
 * HR module — thin shim to @kwim/modules-hr
 */
import { createHrModule } from "@kwim/modules-hr";
import PageTitle from "@/components/utilitie/PageTitle";
import { UserTabbedView } from "@kwim/modules-user";

export const hrModule = createHrModule({ PageTitle, UserManagement: UserTabbedView });

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
