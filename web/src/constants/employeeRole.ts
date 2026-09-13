export interface EmployeeRoleI {
  [key: string]: { label: string; color?: string };
}

export const EMPLOYEE_ROLE: EmployeeRoleI = {
  trainer: { label: "empPage.roles.trainer" },
  sale: {
    label: "empPage.roles.sale",
  },
  assistant: {
    label: "empPage.roles.assistant",
  },
  manager: {
    label: "empPage.roles.manager",
  },
  admin: { label: "empPage.roles.admin" },
};
