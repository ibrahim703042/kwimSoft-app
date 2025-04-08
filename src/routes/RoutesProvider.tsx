import { Route, Routes } from "react-router-dom";
import NotFound from "@/components/NotFound";

import PageTitle from "@/components/utilities/PageTitle";
import Login from "@/pages/login/Login";
import userRoutes from "@/routes/user/userRoutes";
import Dashboard from "@/pages/dashbord/Dashboard";

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
      {/* {administratorRoute} */}
      {userRoutes}

      {/* Auth */}
      <Route path="/login" element={<Login />} />

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}