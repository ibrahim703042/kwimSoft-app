import { Route } from "react-router-dom";
import PageTitle from "@/components/utilitie/PageTitle";
import Reservation from "../../modules/reservation/Reservation";
import { ReactElement, ComponentType } from "react";

// ✅ Define a route item type
type RouteItem = {
  path: string;
  name: string;
  component: ComponentType;
};

export const reservationRouteItems: Record<string, RouteItem> = {
  reservation: {
    path: "reservation",
    name: "Reservation",
    component: Reservation,
  },
};

const reservationRoute: ReactElement[] = Object.values(reservationRouteItems).map(
  (route) => (
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
  )
);

export default reservationRoute;
