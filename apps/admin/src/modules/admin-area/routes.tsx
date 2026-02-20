import { AppRoute } from "@/app/ModuleRegistry";
import PageTitle from "@/components/utilitie/PageTitle";
import AdminAreaShell from "./AdminAreaShell";

export const routes: AppRoute[] = [
  {
    path: "/console",
    element: (
      <>
        <PageTitle title="Admin" />
        <AdminAreaShell />
      </>
    ),
    index: false,
  },
];
