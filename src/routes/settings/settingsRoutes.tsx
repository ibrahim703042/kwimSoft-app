import { Route } from "react-router-dom";
import { ReactElement, ComponentType } from "react";
import Settings from "@/pages/settings";
import PageTitle from "@/components/utilities/PageTitle";

// ✅ Define a route item type
type RouteItem = {
  path: string;
  name: string;
  component: ComponentType;
};

export const settingsRouteItems: Record<string, RouteItem> = {
  settings: {
    path: "settings",
    name: "Settings",
    component: Settings,
  },
};

const settingsRoute: ReactElement[] = Object.entries(settingsRouteItems).map(
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

export default settingsRoute;
