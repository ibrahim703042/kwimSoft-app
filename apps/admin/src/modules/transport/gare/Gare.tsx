import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MapPinPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CrudPage } from "@/core/crud";
import { Button } from "@/components/ui/button";
import { stationApi } from "@/modules/transport/api/transport.api";
import type { StationData } from "./station.types";
import AddGare from "./AddGare";
import EditStation from "./EditStation";

export default function Gare() {
  const navigate = useNavigate();
  const [editStation, setEditStation] = useState<StationData | null>(null);
  const [openDialogEdit, setOpenDialogEdit] = useState(false);

  const columns: ColumnDef<StationData>[] = [
    { accessorKey: "name", header: "Description" },
    { accessorKey: "state", header: "Station" },
    { accessorKey: "country", header: "Pays" },
    { accessorKey: "city", header: "Région" },
    { accessorKey: "address", header: "Adresse" },
  ];

  const handleEdit = (row: StationData) => {
    setEditStation(row);
    setOpenDialogEdit(true);
  };

  return (
    <>
      <CrudPage
        config={{
          title: "Gares",
          queryKey: ["stations"],
          queryFn: stationApi.list,
          columns,
          deleteFn: stationApi.delete,
          permissions: {
            read: "station.read",
            create: "station.create",
            update: "station.update",
            delete: "station.delete",
          },
        }}
        addButton={
          <div className="flex gap-2 items-center">
            <AddGare />
            <Button
              onClick={() => navigate("/administration/map-detail")}
              variant="outline"
              aria-label="Voir la carte des stations"
            >
              <MapPinPlus size={16} />
            </Button>
          </div>
        }
        onEdit={handleEdit}
      />

      {openDialogEdit && editStation && (
        <EditStation
          BusData={editStation}
          openDialog={openDialogEdit}
          setOpenDialog={setOpenDialogEdit}
        />
      )}
    </>
  );
}
