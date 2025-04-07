import { Route } from "react-router-dom";
import UserManagement from "../../pages/usermanagement/UserManagement";
import PageTitle from "../../component/utilitie/PageTitle";

// Définir les objets de chaque route dans administration_routes_items
export const usemanagement_routes_items = {
    usermanagement: {
        path: "/user_management",
        name: "User-management",
        component: UserManagement,
    },

};

// Générer les routes dynamiquement
const usemanagement_routes = Object.values(usemanagement_routes_items).map(route => (
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

export default usemanagement_routes;
