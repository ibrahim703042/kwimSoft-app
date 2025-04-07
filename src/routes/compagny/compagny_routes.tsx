
import { Route } from "react-router-dom";
import PageTitle from "@/component/utilitie/PageTitle";
import ViewCompagny from "../../pages/compagny/ViewCompagny";
import EditCompagny from "../../pages/compagny/EditCompagny";
import DeleteCompagny from "../../pages/compagny/DeleteCompagny";

export const compagny_routes_items = {
    view: {
        path: "/administration/detail_compagny/:id",
        name: "Compagny",
        component: ViewCompagny
    },
    edit: {
        path: "/administration/edit_compagny/:id",
        name: "Compagny",
        component: EditCompagny
    },
    dlete: {
        path: "/administration/delete_compagny/:id",
        name: "Compagny",
        component: DeleteCompagny
    }

}

var compagny_routes = []

for (let key in compagny_routes_items) {
    const route = compagny_routes_items[key]
    compagny_routes.push(
        <Route path={route.path} element={
            <>
                <PageTitle title={route.name} />
                <route.component />
            </>
        } key={route.path} />
    )
}

export default compagny_routes