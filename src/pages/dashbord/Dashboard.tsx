import { useEffect } from "react";
import { ArrowRight } from "react-bootstrap-icons";
import { ChevronRight, MoveRight } from "lucide-react";
import { useDispatch } from "react-redux";

import agenda from "../../assets/img/utils/agenda.png";
import usersIcon from "../../assets/img/utils/usersIcon.png";

import { setBreadCrumbItemsAction } from "../../store/actions/appActions";
import { useUserData } from "../../hooks/useUserData";

import { Button } from "../../components/ui/button";
import TableDashbord from "../../component/updatecomponent/TableDashbord";
import PieChart from "../../component/highcharts/PieChart";
import { dashbordRoutesItems } from "../../routes/dashbord/dashbordRoutes";
import SkeletonCard from "../../components/SkeletonCard";
import ErrorBanner from "../../components/utilities/ErrorBanner";
import StatCard from "../../components/StatCard";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { data, isLoading, isError } = useUserData();

  useEffect(() => {
    dispatch(setBreadCrumbItemsAction([dashbordRoutesItems.dashboard]));
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
              87.849 <span className="text-sm">$</span>
            </p>
          </div>

          <div className="pt-4 flex flex-col md:flex-row md:space-x-3 space-y-2 md:space-y-0">
            <Button className="w-full md:w-auto">Billet restant</Button>
            <Button variant="secondary" className="w-full md:w-auto">
              Compte connecté
            </Button>
          </div>
        </div>

        {/* Agenda */}
        <div className="md:col-span-5 rounded-md p-4 bg-[#0F123F] text-white flex flex-col md:flex-row items-center justify-between transition-colors">
          <div>
            <p className="text-lg font-medium">Agenda des voyages</p>
            <p className="text-sm">
              Cette fonctionnalité est conçue pour simplifier les démarches et
              garantir une organisation fluide.
            </p>
            <div className="mt-4">
              <Button variant="secondary">Compléter mon agenda</Button>
            </div>
          </div>
          <img
            src={agenda}
            alt="Agenda illustration"
            className="w-20 md:w-32 mt-4 md:mt-0"
          />
        </div>
      </div>

      {/* Statistiques utilisateurs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {isLoading && [...Array(4)].map((_, i) => <SkeletonCard key={i} />)}

        {isError && (
          <div className="col-span-2 sm:col-span-4">
            <ErrorBanner message="Impossible de charger les données utilisateur." />
          </div>
        )}

        {!isLoading &&
          !isError &&
          [...Array(4)].map((_, index) => (
            <StatCard
              key={index}
              icon={usersIcon}
              count={data?.length ?? 267}
              label="Utilisateurs"
            />
          ))}
      </div>

      {/* Transactions + Dépenses */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Transactions */}
        <div className="md:col-span-7 bg-white dark:bg-[#1a1f3b] shadow-sm p-4 rounded-md transition-colors">
          <div className="flex items-center justify-between mb-2">
            <p className="font-medium text-sm">Dernières transactions</p>
            <Button variant="outline" className="w-7 h-7 p-1">
              <ChevronRight className="text-lg" />
            </Button>
          </div>

          {[...Array(8)].map((_, index) => (
            <TableDashbord key={index} />
          ))}

          <div className="flex gap-2 items-center justify-center py-1 text-gray-600 dark:text-gray-300">
            <p className="text-sm font-medium">Voir plus</p>
            <MoveRight size={16} />
          </div>
        </div>

        {/* Dépenses - Pie Chart */}
        <div className="md:col-span-5 bg-white dark:bg-[#1a1f3b] shadow-sm p-4 rounded-md transition-colors">
          <div className="flex items-center justify-between mb-4">
            <p className="font-medium text-sm">Toutes les dépenses</p>
            <Button variant="outline" className="w-7 h-7 p-1">
              <ChevronRight className="text-lg" />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            {["Par jour", "Par semaine", "Par mois"].map((label, index) => (
              <div key={index}>
                <p className="text-gray-500 dark:text-gray-400 text-xs">
                  {label}
                </p>
                <p className="font-medium text-lg">
                  {index === 2
                    ? "1.000.000,05"
                    : index === 1
                    ? "1340,05"
                    : "250,05"}
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {" "}
                    $
                  </span>
                </p>
              </div>
            ))}
          </div>

          <PieChart />
        </div>
      </div>
    </div>
  );
}
