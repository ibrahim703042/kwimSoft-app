import { AppRoute } from "@/app/ModuleRegistry";
import { AdministrationPage } from "./pages/AdministrationPage";
import PageTitle from "@/components/utilitie/PageTitle";
import GareMap from "@/modules/transports/gare/GareMap";
import ViewDriver from "@/modules/transports/driver/ViewDriver";

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
  {
    path: "/administration/map-detail",
    element: (
      <>
        <PageTitle title="Map - Stations" />
        <GareMap />
      </>
    ),
    permission: "admin.read",
  },
  {
    path: "/administration/detaillDrive/:id",
    element: (
      <>
        <PageTitle title="Détail chauffeur" />
        <ViewDriver />
      </>
    ),
    permission: "driver.read",
  },
];
