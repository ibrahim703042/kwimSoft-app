import { Route, Routes } from "react-router-dom";
import NotFound from "@/components/NotFound";
import Login from "@/pages/login/Login";
import userRoutes from "@/routes/user/userRoutes";
import Dashboard from "@/pages/dashbord/DashboardPage";
import settingsRoute from "./settings/settingsRoutes";
import customersRoute from "./customer/customerRoutes";
import inventoryRoute from "./inventory/inventoryRoute";
import operationsRoutes from "./operations/operationsRoutes";
import horaireRoutes from "./horaire/horaireRoutes";
import changePasswordRoute from "./settings/changePasswordRoute";
import ProtectedRoute from "./ProtectedRoute";

export default function RoutesProvider() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      {changePasswordRoute}

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
        {inventoryRoute}
        {customersRoute}
        {settingsRoute}
        {userRoutes}
        {operationsRoutes}
        {horaireRoutes}
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
