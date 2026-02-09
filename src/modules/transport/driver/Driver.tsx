import axios from "axios";
import CardDataTable from "@/components/others/carddataTable/CardDataTable";
import { ReusableDataTable } from "@/components/utilitie/ReusableDataTable";
import SearchBar from "@/components/utilitie/SearchBar";
import AddDriver from "./AddDriver";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ClipboardPen, Trash2, Eye } from "lucide-react";
import { useState } from "react";
import EditDriver from "./EditDriver";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import Loading from "@/components/utilitie/Loading";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useUserStore from "@/store/useUserStore";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { Row } from "@tanstack/react-table";
import { API_ROUTE, API_ROUTE_PASSWORD } from "@/config/index";

export interface DriverRow {
    _id: string;
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    licenseNumber?: string;
    licenseDuration?: string;
    birthDate?: string;
    image?: string;
    sexe?: string;
    nationality?: string;
    begginingAt?: string;
    adresse?: string;
    company?: { _id?: string; name?: string };
}

const fetchDrivers = async (search: string) => {
    const url = search ? `${API_ROUTE_PASSWORD}/drivers?search=${search}` : `${API_ROUTE_PASSWORD}/drivers?company/67cfe955595f541695c1b99b`
    const { data } = await axios.get(url);
    return data;
};


export default function Driver() {
    const [search, setSearch] = useState("");
    const { user } = useUserStore()
    console.log("ID COMPAGNY", user);


    const { data: responseData, isLoading } = useQuery({
        queryKey: ["drivers", search],
        queryFn: () => fetchDrivers(search),
        staleTime: 5000,
    });



    const drivers = responseData?.data?.content || [];
    const totalDrivers = responseData?.data?.total || 0;
    const navigate = useNavigate();

    console.log("drivers drivers", drivers);


    const [editData, setEditData] = useState<DriverRow | null>(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);

    const [openModal, setOpenModal] = useState(false);
    const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const columns = [
        {
            header: "Nom",
            accessorKey: "fullName",
        },
        { accessorKey: "email", header: "Email" },
        { accessorKey: "phoneNumber", header: "Téléphone" },
        {
            accessorKey: "company.name",
            header: "Compagnie",
            cell: ({ row }: { row: Row<DriverRow> }) => row.original.company?.name || "N/A",
        },
    ];

    const handleEdit = (DriverData: DriverRow) => {
        setEditData(DriverData);
        setOpenEditDialog(true);
    };

    const deleteDriver = async (DriverId: string) => {
        try {
            await axios.delete(`${API_ROUTE}/drivers/${DriverId}`);
        } catch (error) {
            throw new Error("Erreur lors de la suppression du chauffeur");
        }
    };

    const { mutate, isPending: isDeleting } = useMutation({
        mutationFn: deleteDriver,
        onSuccess: () => {
            Swal.fire({
                title: "Succès!",
                text: "Suppression effectué avec succès.",
                icon: "success",
                confirmButtonText: "OK",
                customClass: { popup: "swal-custom" },
            });
            queryClient.invalidateQueries({ queryKey: ["drivers"] });
            setOpenModal(false);
        },
        onError: (error) => {
            Swal.fire({
                title: "Erreur!",
                text: "Une erreur est survenue. Veuillez réessayer.",
                icon: "error",
                confirmButtonText: "OK",
            });
            console.error("Erreur lors de la suppression :", error.message);
        },
    });

    const handleOpenModal = (DriverId: string) => {
        setSelectedDriverId(DriverId);
        setOpenModal(true);
    };

    const handleDelete = () => {
        if (selectedDriverId) {
            mutate(selectedDriverId);
        }
    };

    return (
        <div>
            <div className="sm:block hidden mb-4">
                <CardDataTable title="Staff" nmbre={totalDrivers} />
            </div>

            <div className="mb-3">
                <SearchBar setSearch={setSearch} />
            </div>

            <div className="bg-white">
                <ReusableDataTable
                    data={drivers}
                    titleDataTable="Staff"
                    columns={columns}
                    isLoading={isLoading}
                    enablePagination={true}
                    pageSize={4}
                    ComponentButtonAdd={<AddDriver />}
                    customActions={(row: DriverRow) => (
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
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span onClick={() => handleOpenModal(row._id)}>
                                            <Button variant="destructive" size="sm" className="p-2">
                                                <Trash2 size={16} />
                                            </Button>
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Supprimer</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    )}
                />
            </div>

            <Dialog open={openModal} onOpenChange={setOpenModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmation</DialogTitle>
                    </DialogHeader>
                    <hr />
                    <div>
                        <p className="text-sm">Voulez-vous vraiment supprimer ce Chauffeur ?</p>
                    </div>
                    <hr />
                    <DialogFooter className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setOpenModal(false)}>Annuler</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? (
                                <div className="flex items-center space-x-2">
                                    <Loading loading={true} />
                                    <span>Suppression...</span>
                                </div>
                            ) : (
                                "Supprimer"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {openEditDialog && (
                <EditDriver
                    DriverData={editData}
                    openDialog={openEditDialog}
                    setOpenDialog={setOpenEditDialog}
                />
            )}
        </div>
    );
}
