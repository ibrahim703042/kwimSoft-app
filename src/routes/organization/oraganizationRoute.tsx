import { Route } from "react-router-dom";
import PageTitle from "@/components/utilitie/PageTitle";
import { ReactElement, ComponentType } from "react";

// Note: These components need to be created or imported from the correct location
// Placeholder components for now
const ViewCompagny = () => <div>View Company</div>;
const EditCompagny = () => <div>Edit Company</div>;
const DeleteCompagny = () => <div>Delete Company</div>;

type RouteItem = {
  path: string;
  name: string;
  component: ComponentType;
};

export const oganizationRouteItems: Record<string, RouteItem> = {
  view: {
    path: "/administration/detail_compagny/:id",
    name: "Compagny",
    component: ViewCompagny,
  },
  edit: {
    path: "/administration/edit_compagny/:id",
    name: "Compagny",
    component: EditCompagny,
  },
  delete: {
    path: "/administration/delete_compagny/:id",
    name: "Compagny",
    component: DeleteCompagny,
  },
};

const oganizationRoute: ReactElement[] = Object.values(oganizationRouteItems).map((route) => (
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

export default oganizationRoute;