import { useEffect } from "react";
import { ArrowRight } from "react-bootstrap-icons";
import { ChevronRight, MoveRight } from "lucide-react";
import { useDispatch } from "react-redux";

import agenda from "@/assets/img/utils/agenda.png";
import usersIcon from "@/assets/img/utils/usersIcon.png";

import { setBreadCrumbItemsAction } from "@/store/actions/appActions";
import { useUserData } from "@/hooks/useUserData";

import { Button } from "@/components/ui/button";
import TableDashbord from "@/components/others/updatecomponent/TableDashbord";
import PieChart from "@/components/others/highcharts/PieChart";
import SkeletonCard from "@/components/SkeletonCard";
import ErrorBanner from "@/components/utilities/ErrorBanner";
import StatCard from "@/components/StatCard";

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { data, isLoading, isError } = useUserData();

  useEffect(() => {
    dispatch(setBreadCrumbItemsAction([{ name: "Dashboard", path: "/" }]));
    return () => {
      dispatch(setBreadCrumbItemsAction([]));
    };
  }, [dispatch]);

  return (
    <div className="p-4 space-y-4 text-gray-800 dark:text-gray-100">
      {/* Montant payé + Agenda */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Montant payé */}
        <div className="md:col-span-7 bg-white dark:bg-[#1a1f3b] rounded-md p-4 shadow-sm py-6 transition-colors">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <p>Compte principal</p>
            <p>Fonds disponibles</p>
          </div>

          <div className="flex justify-between items-center pt-3">
            <div>
              <p className="font-medium">Montant du billet payé</p>
              <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-300">
                <p>Nombre total de billets payés</p>
                <ArrowRight />
              </div>
            </div>
            <p className="font-medium text-lg md:text-2xl">
              {isLoading ? (
                <SkeletonCard />
              ) : isError ? (
                <ErrorBanner />
              ) : (
                `${data?.totalTicketsPaid || 0} FCFA`
              )}
            </p>
          </div>

          <div className="mt-4 flex space-x-3">
            <Button className="text-xs">
              Retirer <ChevronRight />
            </Button>
            <Button className="text-xs" variant="outline">
              Recharger <MoveRight />
            </Button>
          </div>
        </div>

        {/* Agenda */}
        <div className="md:col-span-5 bg-white dark:bg-[#1a1f3b] rounded-md p-4 shadow-sm py-6 transition-colors">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Nombre de réservations
              </p>
              <p className="font-medium text-2xl pt-3">
                {isLoading ? (
                  <SkeletonCard />
                ) : isError ? (
                  <ErrorBanner />
                ) : (
                  data?.totalReservations || 0
                )}
              </p>
            </div>
            <img src={agenda} alt="agenda" className="w-16 h-16" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Users"
          value={isLoading ? "..." : isError ? "Error" : data?.totalUsers || 0}
          icon={usersIcon}
          bgColor="bg-blue-100 dark:bg-blue-900"
        />
        <StatCard
          title="Active Trips"
          value={isLoading ? "..." : isError ? "Error" : data?.activeTrips || 0}
          icon={agenda}
          bgColor="bg-green-100 dark:bg-green-900"
        />
        <StatCard
          title="Revenue"
          value={
            isLoading
              ? "..."
              : isError
              ? "Error"
              : `${data?.totalRevenue || 0} FCFA`
          }
          icon={usersIcon}
          bgColor="bg-purple-100 dark:bg-purple-900"
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-[#1a1f3b] rounded-md p-4 shadow-sm transition-colors">
          <h3 className="font-medium mb-4">Reservations Overview</h3>
          <PieChart />
        </div>
        <div className="bg-white dark:bg-[#1a1f3b] rounded-md p-4 shadow-sm transition-colors">
          <h3 className="font-medium mb-4">Recent Activities</h3>
          <TableDashbord />
        </div>
      </div>
    </div>
  );
}
