import { AppRoute } from "@/app/ModuleRegistry";
import DashboardPage from "./pages/DashboardPage";
import PageTitle from "@/components/utilitie/PageTitle";

export const routes: AppRoute[] = [
  {
    path: "/dashboard",
    element: (
      <>
        <PageTitle title="Dashboard" />
        <DashboardPage />
      </>
    ),
    index: false,
  },
];
