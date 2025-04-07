import { RouteObject } from "react-router-dom";
import Horaire from "../../pages/horaires/Horaire";
import PageTitle from "../../component/utilitie/PageTitle";
import { lazy } from "react";

// Define route config interface
interface ScheduleRouteItem {
  path: string;
  name: string;
  component: React.ComponentType;
}

// Central route config object
export const scheduleRouteItems: Record<string, ScheduleRouteItem> = {
  horaire: {
    path: "horaires",
    name: "Horaires",
    component: Horaire,
  },
};

// Convert to RouteObject array for Router
const SchedeleRoutes: RouteObject[] = Object.values(scheduleRouteItems).map(
  (route) => ({
    path: route.path,
    element: (
      <>
        <PageTitle title={route.name} />
        <route.component />
      </>
    ),
  })
);

export default SchedeleRoutes;
