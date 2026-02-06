import { AppRoute } from "@/app/ModuleRegistry";
import { AdministrationPage } from "./pages/AdministrationPage";
import PageTitle from "@/components/utilitie/PageTitle";

export const routes: AppRoute[] = [
  {
    path: "/administration",
    element: (
      <>
        <PageTitle title="Administration" />
        <AdministrationPage />
      </>
    ),
    permission: "admin.read",
  },
];
