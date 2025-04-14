import { Route } from "react-router-dom";
import GareMap from "../../pages/gare/GareMap";
import Administration from "../../pages/administration/Administration";
import PageTitle from "@/components/utilities/PageTitle";

export const administratorRouteItems = {
  dashboard: {
    path: "/administration",
    name: "Administration",
    component: Administration,
  },
  map: {
    path: "/administration/map-detail",
    name: "Map-view",
    component: GareMap,
  },
};

// Générer les routes dynamiquement
const administratorRoute = Object.values(administratorRouteItems).map(route => (
  <Route
    key={route.path}
    path={route.path}
    element={
      <>
        <PageTitle title={route.name} />
        <route.component />
      </>
    }
  />
));

export default administratorRoute;
