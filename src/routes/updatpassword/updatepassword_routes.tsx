import { Route } from "react-router-dom";
import UpdatePassword from "../../pages/login/UpdatePassword";
import Login from "../../pages/login/Login";


export const updatepassword_routes_items = {
    updatePassword: {
        path: "update-password",
        name: "Update Password",
        component: UpdatePassword,
    },
    loginuser: {
        path: "login",
        name: "Login",
        component: Login,
    },
};

const updatepassword_routes = Object.values(updatepassword_routes_items).map(
    (route) => (
        <Route
            path={route.path}
            element={<route.component />}
            key={route.path}
        />
    )
);

export default updatepassword_routes;
