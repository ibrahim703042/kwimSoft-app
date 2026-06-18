import { ReusableDataTable } from "@/components/map/ReusableDataTable";
import SearchBar from "@/components/shared/SearchBar";
import CardDataTable from "@/components/data-table/CardDataTable";
import AddDriver from "./AddDriver";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import EditDriver from "./EditDriver";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import LoadingState from "@/components/shared/LoadingState";
import { useNavigate } from "react-router-dom";
import { useDrivers, useDeleteDriver } from "@/domains/fleet/hooks";
import type { DriverRecord } from "@/domains/fleet/types";
import DriverRowActions from "./DriverRowActions";

export default function Driver() {
  const [search, setSearch] = useState("");
  const { data: responseData, isLoading } = useDrivers(search);
  const drivers = (responseData as { data?: { content?: DriverRecord[]; total?: number } })?.data?.content || [];
  const totalDrivers = (responseData as { data?: { total?: number } })?.data?.total || 0;
  const navigate = useNavigate();

  const [editData, setEditData] = useState<DriverRecord | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);

  const { mutate, isPending: isDeleting } = useDeleteDriver();

  const columns = [
    { header: "Nom", accessorKey: "fullName" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phoneNumber", header: "Téléphone" },
    {
      accessorKey: "company.name",
      header: "Compagnie",
      cell: ({ row }: { row: { original: { company?: { name?: string } } } }) =>
        row.original.company?.name || "N/A",
    },
  ];

  const handleDelete = () => {
    if (selectedDriverId) {
      mutate(selectedDriverId, { onSuccess: () => setOpenModal(false) });
    }
  };

  return (
    <div>
      <div className="mb-4 hidden sm:block">
        <CardDataTable title="Staff" nmbre={totalDrivers} />
      </div>
      <div className="mb-3">
        <SearchBar setSearch={setSearch} />
      </div>
      <div className="rounded-lg border bg-card">
        <ReusableDataTable<DriverRecord>
          data={drivers}
          titleDataTable="Staff"
          columns={columns}
          isLoading={isLoading}
          enablePagination={true}
          pageSize={4}
          ComponentButtonAdd={<AddDriver />}
          customActions={(row) => (
            <DriverRowActions
              row={row}
              onEdit={(driver) => {
                setEditData(driver);
                setOpenEditDialog(true);
              }}
              onView={(id) => navigate(`/operations/drivers/${id}`)}
              onDelete={(id) => {
                setSelectedDriverId(id);
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
          <p className="text-sm">Voulez-vous vraiment supprimer ce chauffeur ?</p>
          <DialogFooter className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpenModal(false)}>
              Annuler
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? (
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

      {openEditDialog && editData && (
        <EditDriver
          DriverData={editData}
          openDialog={openEditDialog}
          setOpenDialog={setOpenEditDialog}
        />
      )}
    </div>
  );
}
