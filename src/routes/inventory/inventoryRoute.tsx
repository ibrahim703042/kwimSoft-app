import { Route } from "react-router-dom";
import { ReactElement } from "react";
import { RouteItem } from "../routeItem";
import PageTitle from "@/components/utilities/PageTitle";
import InventoryPage from "@/pages/inventory/inventory";

export const inventoryRouteItems: Record<string, RouteItem> = {
  reservation: {
    path: "inventory",
    name: "Inventory",
    description: "Track and manage your product inventory",
    component: InventoryPage,
  },
};

const inventoryRoute: ReactElement[] = Object.entries(inventoryRouteItems).map(
  ([key, route]) => (
    <Route
      key={route.path}
      path={route.path}
      element={
        <>
          <PageTitle title={`${route.name} Management`} description={route.description} />
          <route.component />
        </>
      }
    />
  )
);

export default inventoryRoute;
