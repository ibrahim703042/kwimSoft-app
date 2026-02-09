import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { CrudPage } from "@/core/crud";
import { driverApi } from "../../api/transport.api";
import { Button } from "@/components/ui/button";
import { ClipboardPen, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import AddDriver from "../AddDriver";
import EditDriver from "../EditDriver";

interface Driver {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  licenseNumber?: string;
  licenseDuration?: string;
  birthDate?: string;
  image?: string;
  sexe?: string;
  nationality?: string;
  begginingAt?: string;
  adresse?: string;
  company?: {
    _id?: string;
    name: string;
  };
}

export default function DriverListPage() {
  const navigate = useNavigate();
  const [editData, setEditData] = useState<Driver | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const columns: ColumnDef<Driver>[] = [
    {
      header: "Nom",
      accessorKey: "fullName",
    },
    { 
      accessorKey: "email", 
      header: "Email" 
    },
    { 
      accessorKey: "phoneNumber", 
      header: "Téléphone" 
    },
    {
      accessorKey: "company.name",
      header: "Compagnie",
      cell: ({ row }) => row.original.company?.name || "N/A",
    },
  ];

  const handleEdit = (driver: Driver) => {
    setEditData(driver);
    setOpenEditDialog(true);
  };

  const customActions = (row: Driver) => (
    <div className="flex items-center space-x-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span onClick={() => handleEdit(row)}>
              <Button size="sm" className="p-2">
                <ClipboardPen size={16} />
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Modifier</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span onClick={() => navigate(`/administration/detaillDrive/${row._id}`)}>
              <Button variant="outline" size="sm" className="p-2">
                <Eye size={16} />
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Voir le détail</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );

  return (
    <>
      <CrudPage
        config={{
          title: "Drivers",
          queryKey: ["drivers"],
          queryFn: driverApi.list,
          columns,
          deleteFn: async (id: string) => {
            await driverApi.delete(id);
          },
          permissions: {
            read: "driver.read",
            create: "driver.create",
            update: "driver.update",
            delete: "driver.delete",
          },
          customActions,
        }}
        addButton={<AddDriver />}
        onEdit={handleEdit}
      />

      {openEditDialog && editData && (
        <EditDriver
          DriverData={editData}
          openDialog={openEditDialog}
          setOpenDialog={setOpenEditDialog}
        />
      )}
    </>
  );
}
