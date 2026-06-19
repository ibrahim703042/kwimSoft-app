/**
 * HR module permission constants
 */
export const HR_PERMISSIONS = [
  "employee.read", "employee.create", "employee.update", "employee.delete",
  "driver.read", "driver.create", "driver.update", "driver.delete",
  "user.read", "user.create", "user.update", "user.delete",
  "role.read", "role.create", "role.update", "role.delete",
  "group.read", "group.create", "group.update", "group.delete",
  "department.read", "department.create", "department.update", "department.delete",
  "position.read", "position.create", "position.update", "position.delete",
  "contract.read", "contract.create", "contract.update", "contract.delete",
  "leave.read", "leave.create", "leave.update", "leave.delete",
  "attendance.read", "attendance.create", "attendance.update", "attendance.delete",
  "payroll.read", "payroll.create", "payroll.update", "payroll.delete",
  "recruitment.read", "recruitment.create", "recruitment.update", "recruitment.delete",
  "training.read", "training.create", "training.update", "training.delete",
  "expense.read", "expense.create", "expense.update", "expense.delete",
] as const;
