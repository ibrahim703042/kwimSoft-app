import { Route } from "react-router-dom";
import Ticket from "../../pages/ticket/Ticket";
import PageTitle from "../../component/utilitie/PageTitle";

export const ticket_routes_items = {
  horaire: {
    path: "ticket",
    name: "Ticket",
    component: Ticket,
  },
};

var ticket_routes = [];

for (let key in ticket_routes_items) {
  const route = ticket_routes_items[key];
  ticket_routes.push(
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

export default ticket_routes;

