import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { CrudPage } from "@kwim/core";
import type { StationData } from "./station.types";
import { stationApi } from "../../api/transport.api";
import AddStation from "./AddStation";
import EditStation from "./EditStation";

const columns: ColumnDef<StationData>[] = [
  { accessorKey: "name", header: "Description" },
  { accessorKey: "state", header: "Station" },
  { accessorKey: "country", header: "Pays" },
  { accessorKey: "city", header: "Région" },
  { accessorKey: "address", header: "Adresse" },
];

export default function StationsPage() {
  const [editStation, setEditStation] = useState<StationData | null>(null);
  const [openDialogEdit, setOpenDialogEdit] = useState(false);

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
        addButton={<AddStation />}
        onEdit={handleEdit}
      />

      {openDialogEdit && editStation && (
        <EditStation
          station={editStation}
          openDialog={openDialogEdit}
          setOpenDialog={setOpenDialogEdit}
        />
      )}
    </>
  );
}
