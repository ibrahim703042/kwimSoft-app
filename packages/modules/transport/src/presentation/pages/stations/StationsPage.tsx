import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MapPinPlus } from "lucide-react";
import { CrudPage } from "@kwim/core";
import { Button } from "@kwim/shared-ui";
import { stationApi } from "../../../application/transport.api";
import type { StationData } from "../../../domain/station.types";
import AddStation from "./AddStation";
import EditStation from "./EditStation";
import StationsMapPage from "./StationsMapPage";

interface StationsPageProps {
  readonly onShowMap?: () => void;
}

const columns: ColumnDef<StationData>[] = [
  { accessorKey: "name", header: "Description" },
  { accessorKey: "state", header: "Station" },
  { accessorKey: "country", header: "Pays" },
  { accessorKey: "city", header: "Région" },
  { accessorKey: "address", header: "Adresse" },
];

export default function StationsPage({ onShowMap }: StationsPageProps) {
  const [editStation, setEditStation] = useState<StationData | null>(null);
  const [openDialogEdit, setOpenDialogEdit] = useState(false);
  const [showMap, setShowMap] = useState(false);

  if (showMap) {
    return (
      <div className="space-y-4">
        <Button variant="outline" size="sm" onClick={() => setShowMap(false)}>
          Retour à la liste
        </Button>
        <StationsMapPage />
      </div>
    );
  }

  return (
    <>
      <CrudPage
        config={{
          title: "Gares",
          queryKey: ["stations"],
          queryFn: stationApi.list,
          columns,
          deleteFn: async (id) => {
            await stationApi.delete(id);
          },
          permissions: {
            read: "station.read",
            create: "station.create",
            update: "station.update",
            delete: "station.delete",
          },
        }}
        addButton={
          <div className="flex gap-2 items-center">
            <AddStation />
            <Button
              onClick={() => (onShowMap ? onShowMap() : setShowMap(true))}
              variant="outline"
              aria-label="Voir la carte des stations"
            >
              <MapPinPlus size={16} />
            </Button>
          </div>
        }
        onEdit={(row) => {
          setEditStation(row);
          setOpenDialogEdit(true);
        }}
      />
      {openDialogEdit && editStation && (
        <EditStation station={editStation} openDialog={openDialogEdit} setOpenDialog={setOpenDialogEdit} />
      )}
    </>
  );
}
