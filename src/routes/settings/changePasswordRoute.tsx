import { Route } from "react-router-dom";
import UpdatePassword from "@/pages/login/UpdatePassword";
import PageTitle from "@/components/utilities/PageTitle";

const changePasswordRoute = (
  <Route
    path="/update-password"
    element={
      <>
        <PageTitle title="Mettre à jour le mot de passe" />
        <UpdatePassword />
      </>
    }
  />
);

export default changePasswordRoute;
