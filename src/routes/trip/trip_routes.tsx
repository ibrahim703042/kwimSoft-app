import { Route } from "react-router-dom";
import PageTitle from "../../component/utilitie/PageTitle";
import TripCarto from "../../pages/tripsCarto/TripCarto";
import DetailTrip from "../../pages/trip/DetailTrip";

export const trip_routes_items = {
  trip: {
    path: "trajet",
    name: "Trajet",
    component: TripCarto,
  },
  Detailtrip: {
    path: "/trajet/:id",
    name: "Trajet detail",
    component: DetailTrip,
  },
};

var trip_routes = [];

for (let key in trip_routes_items) {
  const route = trip_routes_items[key];
  trip_routes.push(
    <Route
      path={route.path}
      element={
        <>
          <PageTitle title={route.name} />
          <route.component />
        </>
      }
      key={route.path}
    />
  );
}

export default trip_routes;

