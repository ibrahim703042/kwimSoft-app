// dashboard/index.tsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ChevronRight } from "lucide-react";

import { DollarSign, ShoppingCart, Package, Users } from "lucide-react";

import { setBreadCrumbItemsAction } from "@/store/actions/appActions";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/StatCard";
import { dashbordRoutesItems } from "@/routes/dashbord/dashbordRoutes";
import SkeletonCard from "@/components/SkeletonCard";
import ErrorBanner from "@/components/utilities/ErrorBanner";
import { useUserData } from "@/hooks/useUserData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InventoryTable from "@/components/dashboard/inventory-table";
import RecentActivity from "@/components/dashboard/recent-activity";

export default function Dashboard() {
  const { data, isLoading, isError } = useUserData();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setBreadCrumbItemsAction([dashbordRoutesItems.dashboard]));
    return () => {
      dispatch(setBreadCrumbItemsAction([]));
    };
  }, [dispatch]);

  const metrics = [
    {
      icon: <DollarSign className="w-8 h-8" />,
      value: 128750,
      label: "Revenue",
      prefix: "$",
      trend: 12.5,
    },
    {
      icon: <ShoppingCart className="w-8 h-8" />,
      value: 856,
      label: "Orders",
      trend: 8.2,
    },
    {
      icon: <Package className="w-8 h-8" />,
      value: 1250,
      label: "Products in Stock",
      trend: -2.4,
    },
    {
      icon: <Users className="w-8 h-8" />,
      value: 142,
      label: "Active Employees",
      trend: 4.7,
    },
  ];

  return (
    <div className="p-4 space-y-6 text-gray-800 dark:text-gray-100">
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
            <CardHeader className="flex items-center justify-between">
              {/* <CardTitle>Revenue Breakdown</CardTitle> */}
              <Button variant="outline" size="sm">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardHeader>
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
          <CardHeader className="flex items-center justify-between">
            {/* <CardTitle>Revenue Breakdown</CardTitle> */}
            <Button variant="outline" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardHeader>
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
