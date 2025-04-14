import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setBreadCrumbItemsAction } from "@/store/actions/appActions";
import StatCard from "@/components/StatCard";
import { dashbordRoutesItems } from "@/routes/dashbord/dashbordRoutes";
import SkeletonCard from "@/components/SkeletonCard";
import ErrorBanner from "@/components/utilities/ErrorBanner";
import { useUserData } from "@/hooks/useUserData";
import { Card, CardContent } from "@/components/ui/card";
import InventoryTable from "@/components/dashboard/inventory-table";
import RecentActivity from "@/components/dashboard/recent-activity";
import { t } from "i18next";
import { rawDashboardCards } from "@/constants";

export default function DashboardPage() {
  const { data, isLoading, isError } = useUserData();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setBreadCrumbItemsAction([dashbordRoutesItems.dashboard]));
    return () => {
      dispatch(setBreadCrumbItemsAction([]));
    };
  }, [dispatch]);

  const metrics = rawDashboardCards(t)

  return (
    <div className="p-0 space-y-6 text-gray-800 dark:text-gray-100">
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {isError && <ErrorBanner message="Impossible de charger les données." />}

      {!isLoading && !isError && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <StatCard key={index} {...metric} />
          ))}
        </div>
      )}

      {!isLoading && !isError && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardContent>
              {/* <PieChart /> */}
              <div className="h-40 flex items-center justify-center text-sm text-muted-foreground">
                Coming soon
              </div>
            </CardContent>
          </Card>

          <InventoryTable />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardContent>
            {/* <PieChart /> */}
            <div className="h-40 flex items-center justify-center text-sm text-muted-foreground">
              Coming soon
            </div>
          </CardContent>
        </Card>

        <RecentActivity />
      </div>
    </div>
  );
}
