import { AppRoute } from "@/app/ModuleRegistry";
import DriverListPage from "./pages/DriverListPage";
import PageTitle from "@/components/utilitie/PageTitle";

export const routes: AppRoute[] = [
  {
    path: "/drivers",
    element: (
      <>
        <PageTitle title="Drivers" />
        <DriverListPage />
      </>
    ),
    permission: "driver.read",
  },
];
