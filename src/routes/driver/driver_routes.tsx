
import { Route } from "react-router-dom";
import PageTitle from "@/component/utilitie/PageTitle";
import ViewDriver from "../../pages/driver/ViewDriver";

export const driver_routes_items = {
    dashboard: {
        path: "/administration/detaillDrive/:id",
        name: "Driver_Detail",
        component: ViewDriver
    }

}

var drive_routes = []

for (let key in driver_routes_items) {
    const route = driver_routes_items[key]
    drive_routes.push(
        <Route path={route.path} element={
            <>
                <PageTitle title={route.name} />
                <route.component />
            </>
        } key={route.path} />
    )
}

export default drive_routes