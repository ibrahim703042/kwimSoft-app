import { ClipboardPen, Eye, EyeClosed, Trash2 } from "lucide-react";
import CardDataTable from "../../component/carddataTable/CardDataTable";
import { ReusableDataTable } from "../../component/utilitie/ReusableDataTable";
import SearchBar from "../../component/utilitie/SearchBar";
import { Button } from "../../components/ui/button";
import AddBus from "./AddBus";
import { useNavigate } from "react-router-dom";
import { API_ROUTE } from "../../../config";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import EditBus from "./EditBus";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "../../components/ui/dialog";
import ScaleLoader from "react-spinners/ScaleLoader";
import AddSeats from "./AddSeats";


const fetchBus = async () => {
    const { data } = await axios.get(`${API_ROUTE}/buses/company/67bc9002f682d26a7f7a9200`);
    return data;
};

export default function Bus() {
    const navigate = useNavigate();
    const [editData, setEditData] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const queryClient = useQueryClient();
    const [openModal, setOpenModal] = useState(false);
    const [selectedCompanyId, setSelectedCompanyId] = useState(null);
    const [busId, setBusId] = useState(null)

    const { data: responseData, isLoading, error } = useQuery({
        queryKey: ["buses"],
        queryFn: fetchBus,
    });

    const buse = responseData?.data?.content || [];
    console.log("BUS recuperation", buse);


    const deleteCompany = async (busId) => {
        await axios.delete(`${API_ROUTE}/buses/${busId}`);
    };

    const { mutate, isLoading: isDeleting } = useMutation({
        mutationFn: deleteCompany,
        onSuccess: () => {
            queryClient.invalidateQueries(["buses"]);
            setOpenModal(false);
        },
        onError: (error) => {
            console.error("Erreur lors de la suppression :", error);
        },
    });

    const handleOpenModal = (busId) => {
        setSelectedCompanyId(busId);
        setOpenModal(true);
    };

    const handleDelete = () => {
        try {
            mutate(selectedCompanyId);
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
        }
    };

    const handleEdit = (BusData) => {
        console.log("id edit:::::", BusData);
        setEditData(BusData);
        setOpenEditDialog(true);
    }

    const handleDataBus = (row) => {
        setBusId(row)
    }
    const columns = [
        { accessorKey: "driver.fullName", header: "Chauffeur" },
        { accessorKey: "modele", header: "Modele" },
        { accessorKey: "manufacture", header: "Fabriquant" },
        { accessorKey: "licensePlate", header: "Immatriculation" },
        { accessorKey: "totalSeats", header: "Total siege" },
    ];

    return (
        <div>
            <div className="sm:block hidden">
                <CardDataTable title="Bus" nmbre={0} />
            </div>

            <div className="mb-3">
                <SearchBar />
            </div>

            <div className="bg-white rounded-lg">
            <AddSeats busId={busId}/>
                <ReusableDataTable
                    data={buse}
                    titleDataTable="Bus"
                    columns={columns}
                    ComponentButtonAdd={<AddBus />}
                    isLoading={isLoading}
                    enablePagination={true}
                    pageSize={4}
                    customActions={(row) => (
                        <div className="flex items-center space-x-2">
                            <Button size="sm" className="p-2" title="Modifier" onClick={() => handleEdit(row)}>
                                <ClipboardPen size={16} />
                            </Button>
                            <Button variant="outline" size="sm" className="p-2" title="Voir" onClick={() => navigate(`/administration/detaillBus/${row._id}`)}>
                                <Eye size={16} />
                            </Button>
                            <div onClick={() => handleDataBus(row)}>
                                <AddSeats busId={busId}/>
                            </div>
                            <Button variant="destructive" size="sm" className="p-2" title="Supprimer" onClick={() => handleOpenModal(row._id)}>
                                <Trash2 size={16} />
                            </Button>
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
                        <p className="text-sm">Voulez-vous vraiment supprimer cette bus ?</p>
                    </div>
                    <hr />
                    <DialogFooter className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setOpenModal(false)}>Annuler</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? (
                                <div className="flex items-center space-x-2">
                                    <ScaleLoader color="#ffffff" height={10} />
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
                <EditBus
                    BusData={editData}
                    openDialog={openEditDialog}
                    setOpenDialog={setOpenEditDialog}
                />
            )}
        </div>
    )
}
