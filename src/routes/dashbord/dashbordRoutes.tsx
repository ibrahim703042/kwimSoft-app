import { Route } from "react-router-dom";
import Dashboard from "../../pages/dashbord/Dashboard";
import PageTitle from "../../component/utilitie/PageTitle";

// Define route config type
type DashboardRouteItem = {
  path: string;
  name: string;
  component: React.ComponentType;
};

// Route config object
export const dashbordRoutesItems: Record<string, DashboardRouteItem> = {
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
