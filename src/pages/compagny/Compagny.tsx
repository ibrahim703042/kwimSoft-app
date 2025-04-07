import { ClipboardPen, Eye, EyeClosed, Trash2 } from "lucide-react";
import CardDataTable from "../../component/carddataTable/CardDataTable";
import { ReusableDataTable } from "../../component/utilitie/ReusableDataTable";
import SearchBar from "../../component/utilitie/SearchBar";
import { Button } from "../../components/ui/button";
import AddCompagny from "./AddCompagny";
import { API_ROUTE } from "../../../config";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import EditCompany from "./EditCompagny";
import ScaleLoader from "react-spinners/ScaleLoader";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../@/components/ui/tooltip";

const fetchCompagnie = async (search) => {
    const url = search ? `${API_ROUTE}/companies?search=${search}` : `${API_ROUTE}/companies`
    const { data } = await axios.get(url);
    return data;
};

export default function Compagny() {
    const [search, setSearch] = useState("");

    const { data: responseData, isLoading, error } = useQuery({
        queryKey: ["compagnie", search],
        queryFn: () => fetchCompagnie(search),
        staleTime: 5000,
    });

    const queryClient = useQueryClient();
    const compagnie = responseData?.data?.content || [];
    const totalCompagnies = responseData?.data?.total || 0;
    const { t } = useTranslation();
    const [openModal, setOpenModal] = useState(false);
    const [selectedCompanyId, setSelectedCompanyId] = useState(null);
    const navigate = useNavigate();
    const [editData, setEditData] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);



    console.log("searchsearchsearch", compagnie);



    // Supprimer la compagnie
    const deleteCompany = async (companyId) => {
        await axios.delete(`${API_ROUTE}/companies/${companyId}`);
    };

    const { mutate, isLoading: isDeleting } = useMutation({
        mutationFn: deleteCompany,
        onSuccess: () => {
            queryClient.invalidateQueries(["compagnie"]);
            setOpenModal(false);
        },
        onError: (error) => {
            console.error("Erreur lors de la suppression :", error);
        },
    });

    const handleOpenModal = (companyId) => {
        setSelectedCompanyId(companyId);
        setOpenModal(true);
    };

    const handleDelete = () => {
        try {
            mutate(selectedCompanyId);
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
        }
    };

    const handleEdit = (compagnyData) => {
        console.log("id edit:::::", compagnyData);
        setEditData(compagnyData);
        setOpenEditDialog(true);
    }

    const columns = [
        { accessorKey: "name", header: "Nom" },
        { accessorKey: "country.name.common", header: "Pays" },
        { accessorKey: "transportLicenseNumber", header: "Licence", cell: (info) => <span className="whitespace-nowrap">{info.getValue()}</span> },
        { accessorKey: "email", header: "Email" },
        { accessorKey: "totalBus", header: "Total Bus" },
    ];

    return (
        <div>
            <div className="sm:block hidden">
                <CardDataTable title="Compagnie" nmbre={totalCompagnies} />
            </div>

            <div className="mb-3">
                <SearchBar setSearch={setSearch} />
            </div>

            <div className="bg-white rounded-md">
                <ReusableDataTable
                    data={compagnie}
                    titleDataTable={t("compagnieliste")}
                    columns={columns}
                    enablePagination={true}
                    pageSize={4}
                    isLoading={isLoading}
                    ComponentButtonAdd={<AddCompagny />}
                    customActions={(row) => (
                        <div className="flex items-center space-x-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span onClick={() => handleEdit(row)}>
                                            <Button size="sm" className="p-2">
                                                <ClipboardPen size={7} />
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
                                        <span onClick={() => navigate(`/administration/detail_compagny/${row._id}`)}>
                                            <Button variant="outline" size="sm" className="p-2">
                                                <Eye size={7} />
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
                                                <Trash2 size={7} />
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
                        <p className="text-sm">Voulez-vous vraiment supprimer cette compagnie ?</p>
                    </div>
                    <hr />
                    <DialogFooter className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setOpenModal(false)}>Annuler</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? (
                                <div className="flex items-center space-x-2">
                                    <ScaleLoader color="#0F123F" height={15} />
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
                <EditCompany
                    compagnyData={editData}
                    openDialog={openEditDialog}
                    setOpenDialog={setOpenEditDialog}
                />
            )}
        </div>
    );
}
