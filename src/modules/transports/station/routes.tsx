import { AppRoute } from "@/app/ModuleRegistry";
import { StationListPage } from "./pages/StationListPage";
import PageTitle from "@/components/utilitie/PageTitle";

export const routes: AppRoute[] = [
  {
    path: "/stations",
    element: (
      <>
        <PageTitle title="Stations" />
        <StationListPage />
      </>
    ),
    permission: "station.read",
  },
];
