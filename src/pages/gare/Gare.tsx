import { MapPinPlus } from "lucide-react";
import CardDataTable from "@/components/data-table/CardDataTable";
import { ReusableDataTable } from "@/components/map/ReusableDataTable";
import SearchBar from "@/components/shared/SearchBar";
import { Button } from "@/components/ui/button";
import AddGare from "./AddGare";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";
import EditStation from "./EditStation";
import { useNavigate } from "react-router-dom";
import { useStations, useDeleteStation } from "@/domains/network/hooks";
import StationRowActions from "./StationRowActions";

interface StationRow {
  _id: string;
  name?: string;
  state?: string;
  country?: string;
  city?: string;
  address?: string;
}

export default function Gare() {
  const { data: responseData, isLoading, isError, refetch } = useStations();
  const deleteStation = useDeleteStation();

  const stations: StationRow[] = (responseData as { data?: { content?: StationRow[] } })?.data?.content ?? [];
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [editStation, setEditStation] = useState<StationRow | null>(null);
  const [openDialogEdit, setOpenDialogEdit] = useState(false);
  const navigate = useNavigate();

  const columns = [
    { accessorKey: "name", header: "Description" },
    { accessorKey: "state", header: "Station" },
    { accessorKey: "country", header: "Pays" },
    { accessorKey: "city", header: "Région" },
    { accessorKey: "address", header: "Adresse" },
  ];

  const handleDelete = () => {
    if (!deleteId) return;
    deleteStation.mutate(deleteId, {
      onSuccess: () => {
        setOpenModal(false);
        setDeleteId(null);
      },
    });
  };

  if (isError) {
    return (
      <ErrorState
        title="Impossible de charger les stations"
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div>
      <div className="hidden sm:block">
        <CardDataTable title="Gare" nmbre={stations.length} />
      </div>

      <div className="mb-3">
        <SearchBar setSearch={() => { return; }} />
      </div>

      <div className="rounded-lg bg-white">
        <ReusableDataTable<StationRow>
          data={stations}
          titleDataTable="Gare"
          columns={columns}
          ComponentButtonAdd={
            <div className="flex items-center gap-2">
              <AddGare />
              <Button type="button" onClick={() => navigate("/operations/map")} variant="outline">
                <MapPinPlus size={10} />
              </Button>
            </div>
          }
          isLoading={isLoading}
          enablePagination
          pageSize={4}
          customActions={(row) => (
            <StationRowActions
              row={row}
              onEdit={(station) => {
                setEditStation(station);
                setOpenDialogEdit(true);
              }}
              onDelete={(id) => {
                setDeleteId(id);
                setOpenModal(true);
              }}
            />
          )}
        />
      </div>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmation</DialogTitle>
          </DialogHeader>
          <p className="text-sm">Voulez-vous vraiment supprimer cette station ?</p>
          <DialogFooter className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpenModal(false)}>
              Annuler
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteStation.isPending}
            >
              {deleteStation.isPending ? (
                <span className="flex items-center gap-2">
                  <LoadingState loading className="py-0" />
                  Suppression...
                </span>
              ) : (
                "Supprimer"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {openDialogEdit && editStation && (
        <EditStation
          BusData={editStation}
          openDialog={openDialogEdit}
          setOpenDialog={setOpenDialogEdit}
        />
      )}
    </div>
  );
}
