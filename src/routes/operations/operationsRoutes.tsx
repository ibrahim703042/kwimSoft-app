import { Navigate, Route } from "react-router-dom";
import PageTitle from "@/components/utilities/PageTitle";
import OperationsPage from "@/pages/operations/OperationsPage";
import GareMap from "@/pages/gare/GareMap";

export const operationsRouteItems = {
  main: {
    path: "/operations",
    name: "Operations",
    component: OperationsPage,
  },
  map: {
    path: "/operations/map",
    name: "Station map",
    component: GareMap,
  },
};

const operationsRoutes = [
  <Route
    key="admin-redirect"
    path="/administration"
    element={<Navigate to="/operations" replace />}
  />,
  <Route
    key="admin-drive-redirect"
    path="/administration/detaillDrive/:id"
    element={<Navigate to="/operations" replace />}
  />,
  <Route
    key="admin-map-redirect"
    path="/administration/map-detail"
    element={<Navigate to="/operations/map" replace />}
  />,
  ...Object.values(operationsRouteItems).map((route) => (
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
  )),
];

export default operationsRoutes;
