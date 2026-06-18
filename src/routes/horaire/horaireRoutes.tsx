import { Route } from "react-router-dom";
import { ReactElement } from "react";
import PageTitle from "@/components/utilities/PageTitle";
import Horaire from "@/pages/horaires/Horaire";

export const scheduleRouteItems = {
  horaire: {
    path: "horaires",
    name: "Horaires",
    description: "Gestion des horaires",
    component: Horaire,
  },
};

const horaireRoutes: ReactElement[] = Object.values(scheduleRouteItems).map(
  (route) => (
    <Route
      key={route.path}
      path={route.path}
      element={
        <>
          <PageTitle title={route.name} description={route.description} />
          <route.component />
        </>
      }
    />
  )
);

export default horaireRoutes;
