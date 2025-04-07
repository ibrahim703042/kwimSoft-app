import { Route } from "react-router-dom";
import PageTitle from "../../component/utilitie/PageTitle";
import Reservation from "../../pages/reservation/Reservation";


export const reseravtion_routes_items = {
    reservation: {
        path: "reservation",
        name: "Reservqtion",
        component: Reservation,
    },

};

var reservation_routes = [];

for (let key in reseravtion_routes_items) {
    const route = reseravtion_routes_items[key];
    reservation_routes.push(
        <Route
            path={route.path}
            element={
                <>
                    <PageTitle title={route.name} />
                    <route.component />
                </>
            }
            key={route.path}
        />
    );
}

export default reservation_routes;

