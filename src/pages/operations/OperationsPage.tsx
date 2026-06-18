import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Users, Bus, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import FeatureTabShell from "@/components/shared/FeatureTabShell";
import Driver from "@/pages/driver/Driver";
import Gare from "@/pages/gare/Gare";
import { setBreadCrumbItemsAction } from "@/store/actions/appActions";

function BusPlaceholder() {
  return (
    <div className="rounded-lg border bg-card p-12 text-center text-muted-foreground">
      Fleet / bus management module — connect API when available.
    </div>
  );
}

export default function OperationsPage() {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(
      setBreadCrumbItemsAction([{ path: "/operations", name: t("sidebar.operations") }])
    );
    return () => {
      dispatch(setBreadCrumbItemsAction([]));
    };
  }, [dispatch, t]);

  return (
    <FeatureTabShell
      title={t("sidebar.operations")}
      mobileTitle={t("sidebar.operations")}
      options={[
        { name: "Staff", component: Driver, icon: Users },
        { name: t("links.bus"), component: BusPlaceholder, icon: Bus },
        { name: "Stations", component: Gare, icon: MapPin },
      ]}
    />
  );
}
