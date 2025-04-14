import { Route } from "react-router-dom";
import { ReactElement, ComponentType } from "react";
import PageTitle from "@/components/utilities/PageTitle";
import CustomersPage from "@/pages/customer";

// ✅ Define a route item type
type RouteItem = {
  path: string;
  name: string;
  component: ComponentType;
};

export const customersRouteItems: Record<string, RouteItem> = {
  customers: {
    path: "customers",
    name: "Customers",
    component: CustomersPage,
  },
};

const customersRoute: ReactElement[] = Object.entries(customersRouteItems).map(
  ([key, route]) => (
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

export default customersRoute;
