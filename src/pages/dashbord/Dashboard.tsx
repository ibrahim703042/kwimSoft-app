import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ChevronRight } from "lucide-react";

import revenueIcon from "@/assets/img/utils/revenue.png";
import ordersIcon from "@/assets/img/utils/orders.png";
import inventoryIcon from "@/assets/img/utils/inventory.png";
import employeesIcon from "@/assets/img/utils/employees.png";

import { setBreadCrumbItemsAction } from "@/store/actions/appActions";
import { Button } from "@/components/ui/button";
import PieChart from "@/components/charts/PieChart";
import StatCard from "@/components/StatCard";
import { dashbordRoutesItems } from "@/routes/dashbord/dashbordRoutes";
import SkeletonCard from "@/components/SkeletonCard";
import ErrorBanner from "@/components/utilities/ErrorBanner";
import { useUserData } from "@/hooks/useUserData";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { data, isLoading, isError } = useUserData();

  useEffect(() => {
    dispatch(setBreadCrumbItemsAction([dashbordRoutesItems.dashboard]));
    return () => {
      dispatch(setBreadCrumbItemsAction([]));
    };
  }, [dispatch]);

  const metrics = [
    {
      icon: revenueIcon,
      value: 128750,
      label: "Revenue",
      prefix: "$",
      trend: 12.5
    },
    {
      icon: ordersIcon,
      value: 856,
      label: "Orders",
      trend: 8.2
    },
    {
      icon: inventoryIcon,
      value: 1250,
      label: "Products in Stock",
      trend: -2.4
    },
    {
      icon: employeesIcon,
      value: 142,
      label: "Active Employees",
      trend: 4.7
    }
  ];

  return (
    <div className="p-4 space-y-6 text-gray-800 dark:text-gray-100">
      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <ErrorBanner message="Impossible de charger les données." />
      )}


      {/* Metrics Grid */}
      {!isLoading && !isError && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <StatCard key={index} {...metric} />
          ))}
        </div>
      )}

      {/* Charts and Analytics */}
      {!isLoading && !isError && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white dark:bg-[#1a1f3b] rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold">Revenue Breakdown</h3>
              <Button variant="outline" size="sm">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <PieChart />
          </div>

          <div className="bg-white dark:bg-[#1a1f3b] rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold">Recent Orders</h3>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            {/* Add OrderTable component here */}
          </div>
        </div>
      )}
    </div>
  );
}