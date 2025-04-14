import { Route } from "react-router-dom";
import UpdatePassword from "../../pages/login/UpdatePassword";
import Login from "../../pages/login/Login";


export const changePasswordRouteItem = {
    updatePassword: {
        path: "change-password",
        name: "Change Password",
        component: UpdatePassword,
    },
    loginuser: {
        path: "login",
        name: "Login",
        component: Login,
    },
};

const changepasswordRoute = Object.values(changePasswordRouteItem).map(
    (route) => (
        <Route
            path={route.path}
            element={<route.component />}
            key={route.path}
        />
    )
);

export default changepasswordRoute;
