import { AppRoute } from "@/app/ModuleRegistry";
import { ReservationPage } from "./pages/ReservationPage";
import PageTitle from "@/components/utilitie/PageTitle";

export const routes: AppRoute[] = [
  {
    path: "/reservations",
    element: (
      <>
        <PageTitle title="Reservations" />
        <ReservationPage />
      </>
    ),
    permission: "reservation.read",
  },
];
