
import { Route } from "react-router-dom";
import PageTitle from "@/component/utilitie/PageTitle";
import DetailBus from "../../pages/bus/DetailBus";

export const bus_routes_items = {
    dashboard: {
        path: "/administration/detaillBus/:id",
        name: "Bus_Detail",
        component: DetailBus
    }

}

var bus_routes = []

for (let key in bus_routes_items) {
    const route = bus_routes_items[key]
    bus_routes.push(
        <Route path={route.path} element={
            <>
                <PageTitle title={route.name} />
                <route.component />
            </>
        } key={route.path} />
    )
}

export default bus_routes