import { Route } from "react-router-dom";
import PageTitle from "../../component/utilitie/PageTitle";
import ViewSeats from "../../pages/seat/ViewSeats";


export const seats_routes_items = {
    reservation: {
        path: "/administration/detail_seat/:id",
        name: "Seats",
        component: ViewSeats,
    },

};

var seats_routes = [];

for (let key in seats_routes_items) {
    const route = seats_routes_items[key];
    seats_routes.push(
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

export default seats_routes;

