import { AppRoute } from "@/app/ModuleRegistry";
import { UserManagementPage } from "./pages/UserManagementPage";
import PageTitle from "@/components/utilitie/PageTitle";

export const routes: AppRoute[] = [
  {
    path: "/user-management",
    element: (
      <>
        <PageTitle title="User Management" />
        <UserManagementPage />
      </>
    ),
    permission: "user.read",
  },
];
