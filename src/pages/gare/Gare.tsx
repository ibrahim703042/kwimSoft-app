import { ClipboardPen, MapPinPlus, Trash2 } from "lucide-react";
import CardDataTable from "../../component/carddataTable/CardDataTable";
import { ReusableDataTable } from "../../component/utilitie/ReusableDataTable";
import SearchBar from "../../component/utilitie/SearchBar";
import { Button } from "../../components/ui/button";
import AddGare from "./AddGare";
import axios from "axios";
import { API_ROUTE } from "../../../config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import Loading from "../../component/utilitie/Loading";
import EditStation from "./EditStation";
import { useNavigate } from "react-router-dom";


const fetchStation = async () => {
    const { data } = await axios.get(`${API_ROUTE}/stations/no-pagination/company/67bc9002f682d26a7f7a9200`);
    return data;
};

export default function Gare() {
    const { data: responseData, isLoading, error } = useQuery({
        queryKey: ["statations"],
        queryFn: fetchStation,
    });

    const Station = responseData?.data || [];
    const [edit, setEdit] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const queryClient = useQueryClient();
    const [editeStation, setEditStation] = useState(null)
    const [openDialogEdit, setOpenDialogEdit] = useState(false)
    const navigate = useNavigate()

    const HandleNavigate = () => {
        navigate("/administration/map-detail")
    }

    const deleteSatation = async (Id) => {
        await axios.delete(`${API_ROUTE}/stations/${Id}`);
    };

    const { mutate, isLoading: isDeleting } = useMutation({
        mutationFn: deleteSatation,
        onSuccess: () => {
            queryClient.invalidateQueries(["statations"]); // <- Vérifie l'orthographe
            setOpenModal(false);
        },
        onError: (error) => {
            console.error("Erreur lors de la suppression :", error);
        },
    });

    const handleOpenModal = (row) => {
        console.log("DELETE", row);
        setEdit(row._id); // <- Stocke uniquement l'ID et non l'objet entier
        setOpenModal(true);
    };

    const handleDelete = () => {
        if (edit) {
            mutate(edit); // <- Passe l'ID correct à deleteSatation
        } else {
            console.error("Erreur : aucun ID à supprimer !");
        }
    };

    const handleEdit = (row) => {
        setEditStation(row)
        setOpenDialogEdit(true)
        console.log("::::::::::::Detail", row);

    }

    const columns = [
        { accessorKey: "name", header: "Description" },
        { accessorKey: "state", header: "Station" },
        { accessorKey: "country", header: "Pays" },
        { accessorKey: "city", header: "Région" },
        { accessorKey: "address", header: "Adresse" },
    ];
    return (
        <div>
            <div className="sm:block hidden">
                <CardDataTable title="Gare" nmbre={0} />
            </div>

            <div className="mb-3">
                <SearchBar />
            </div>
            <div className="bg-white rounded-lg">
                <ReusableDataTable
                    data={Station}
                    titleDataTable="Gare"
                    columns={columns}
                    ComponentButtonAdd={<div className="flex gap-2 items-center">
                        <AddGare />
                        <Button onClick={HandleNavigate} variant="outline">
                            <MapPinPlus size={10} />
                        </Button>
                    </div>}
                    isLoading={isLoading}
                    enablePagination={true}
                    pageSize={4}
                    customActions={(row) => (
                        <div className="flex items-center space-x-2">
                            <Button size="sm" className="p-2" title="Modifier" onClick={() => handleEdit(row)}>
                                <ClipboardPen size={16} />
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                className="p-2"
                                title="Supprimer"
                                onClick={() => handleOpenModal(row)}
                            >
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
                        <p className="text-sm">Voulez-vous vraiment supprimer cette station ?</p>
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

            {setOpenDialogEdit && (
                <EditStation
                    BusData={editeStation}
                    openDialog={openDialogEdit}
                    setOpenDialog={setOpenDialogEdit}
                />
            )}

        </div>
    )
}
