import { Route } from "react-router-dom";
import Dashboard from "../../pages/dashbord/DashboardPage";
import PageTitle from "@/components/utilities/PageTitle";
import { RouteItem } from "../routeItem";

// Route config object
export const dashbordRoutesItems: Record<string, RouteItem> = {
  dashboard: {
    path: "dashboard",
    name: "Tableau de bord",
    component: Dashboard,
  },
};

// Generate route list
const dashbord_routes = Object.values(dashbordRoutesItems).map((route) => (
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

export default dashbord_routes;
