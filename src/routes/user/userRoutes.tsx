import { Route } from "react-router-dom";
import UserManagement from "../../pages/user-management/UserManagement";
import PageTitle from "../../component/utilitie/PageTitle";

export const userRouteItems = {
    usermanagement: {
        path: "/user-management",
        name: "User-management",
        component: UserManagement,
    },

};

// Générer les routes dynamiquement
const userRoutes = Object.values(userRouteItems).map(route => (
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

export default userRoutes;
