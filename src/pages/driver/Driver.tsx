import axios from "axios";
import { API_ROUTE, API_ROUTE_PASSWORD } from "../../../config";
import CardDataTable from "../../component/carddataTable/CardDataTable";
import { ReusableDataTable } from "../../component/utilitie/ReusableDataTable";
import SearchBar from "../../component/utilitie/SearchBar";
import AddDriver from "./AddDriver";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ClipboardPen, Trash2, EyeClosed, Eye } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import EditDriver from "./EditDriver";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import Loading from "../../component/utilitie/Loading";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../@/components/ui/tooltip";
import useUserStore from "../../store/useUserStore";

const fetchDrivers = async (search) => {
    const url = search ? `${API_ROUTE_PASSWORD}/drivers?search=${search}` : `${API_ROUTE_PASSWORD}/drivers?company/67cfe955595f541695c1b99b`
    const { data } = await axios.get(url);
    return data;
};


export default function Driver() {
    const [search, setSearch] = useState("");
    const { user } = useUserStore()
    console.log("ID COMPAGNY", user);


    const { data: responseData, isLoading, error } = useQuery({
        queryKey: ["drivers", search],
        queryFn: () => fetchDrivers(search),
        staleTime: 5000,
    });



    const drivers = responseData?.data?.content || [];
    const totalDrivers = responseData?.data?.total || 0;
    const { t } = useTranslation();
    const navigate = useNavigate();

    console.log("drivers drivers", drivers);


    const [editData, setEditData] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);

    const [openModal, setOpenModal] = useState(false);
    const [selectedDriverId, setSelectedDriverId] = useState(null);
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
            cell: ({ row }) => row.original.company?.name || "N/A",
        },
    ];

    const handleEdit = (DriverData) => {
        setEditData(DriverData);
        setOpenEditDialog(true);
    };

    const deleteDriver = async (DriverId) => {
        try {
            await axios.delete(`${API_ROUTE}/drivers/${DriverId}`);
        } catch (error) {
            throw new Error("Erreur lors de la suppression du chauffeur");
        }
    };

    const { mutate, isLoading: isDeleting } = useMutation({
        mutationFn: deleteDriver,
        onSuccess: () => {
            Swal.fire({
                title: "Succès!",
                text: "Suppression effectué avec succès.",
                icon: "success",
                confirmButtonText: "OK",
                customClass: { popup: "swal-custom" },
            });
            queryClient.invalidateQueries(["drivers"]);
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

    const handleOpenModal = (DriverId) => {
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
                    customActions={(row) => (
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
