import { Route } from "react-router-dom";
import PageTitle from "@/component/utilitie/PageTitle";
import Administration from "@/pages/administration/Administration";
import GareMap from "../../pages/gare/GareMap";

// Définir les objets de chaque route dans administration_routes_items
export const administration_routes_items = {
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
const administration_routes = Object.values(administration_routes_items).map(route => (
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

export default administration_routes;
