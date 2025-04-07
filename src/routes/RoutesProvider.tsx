import { Route, Routes } from "react-router-dom";
import NotFound from "../component/app/NotFound";

// // Route modules
// import SchedeleRoutes from "./horaire/horaire_ro

import PageTitle from "../component/utilitie/PageTitle";
import Login from "../pages/login/Login";
import userRoutes from "./user/userRoutes";
import Dashboard from "../pages/dashbord/Dashboard";

export default function RoutesProvider() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <PageTitle title="Dashboard" />
            <Dashboard />
          </>
        }
      />

      {/* Route modules */}
      {/* {SchedeleRoutes} */}
      {/* {administration_routes} */}
      {/* {ticket_routes} */}
      {/* {trip_routes} */}
      {/* {bus_routes} */}
      {/* {reservation_routes} */}
      {/* {compagny_routes} */}
      {/* {drive_routes} */}
      {/* {seats_routes} */}
      {userRoutes}

      {/* Auth */}
      <Route path="/login" element={<Login />} />

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
