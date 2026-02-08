import { AppRoute } from "@/app/ModuleRegistry";
import { SchedulePage } from "./pages/SchedulePage";
import PageTitle from "@/components/utilitie/PageTitle";

export const routes: AppRoute[] = [
  {
    path: "/schedules",
    element: (
      <>
        <PageTitle title="Schedules" />
        <SchedulePage />
      </>
    ),
    permission: "schedule.read",
  },
];
