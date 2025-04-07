import { Trash2 } from "lucide-react";
import CardDataTable from "../../component/carddataTable/CardDataTable";
import { ReusableDataTable } from "../../component/utilitie/ReusableDataTable";
import SearchBar from "../../component/utilitie/SearchBar";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { API_ROUTE } from "../../../config";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import Loading from "../../component/utilitie/Loading";
import EditSeat from "./EditSeat";

const fetchBus = async () => {
    const { data } = await axios.get(`${API_ROUTE}/buses`);
    return data;
};

const fetchSaets = async () => {
    try {
        const { data } = await axios.get(`${API_ROUTE}/seats/bus-filters/67c08e19b8c8f64c6ef8bab7`);
        return data;
    } catch (error) {
        console.error("Erreur lors de la récupération des voyages :", error);
        throw new Error("Impossible de récupérer les données du voyage.");
    }
};


export default function Bus() {

    const navigate = useNavigate();
    const [editData, setEditData] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const queryClient = useQueryClient();

    const [openModal, setOpenModal] = useState(false);
    const [selectedCompanyId, setSelectedCompanyId] = useState(null);

    const { data: responseData, isLoading, error } = useQuery({
        queryKey: ["buses"],
        queryFn: fetchBus,
    });

    const { data: responseSeats, isLoading: isLoadingSeats, error: errorSeta } = useQuery({
        queryKey: ["seats"],
        queryFn: fetchSaets,
    });

    const buse = responseData?.data?.content || [];
    const seats = responseSeats?.data?.content || []
    console.log("SEATS::::::::", seats);
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
    const columns = [
        { accessorKey: "company.name", header: "Bus" },
        { accessorKey: "column", header: "Colonne" },
        { accessorKey: "row", header: "Ranger" },
        { accessorKey: "type", header: "Type" },
        { accessorKey: "placement", header: "Placement" },
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
                <ReusableDataTable
                    data={seats}
                    titleDataTable="Seats"
                    columns={columns}
                    ComponentButtonAdd={null}
                    isLoading={isLoading}
                    enablePagination={true}
                    pageSize={4}
                    customActions={(row) => (
                        <div className="flex items-center space-x-2">
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
                    <p>Voulez-vous vraiment supprimer cette Seat ?</p>
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
                <EditSeat
                    BusData={editData}
                    openDialog={openEditDialog}
                    setOpenDialog={setOpenEditDialog}
                />
            )}
        </div>
    )
}
