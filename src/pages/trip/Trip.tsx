import { ClipboardPen, EyeClosed, Trash2 } from "lucide-react";
import CardDataTable from "../../component/carddataTable/CardDataTable";
import { ReusableDataTable } from "../../component/utilitie/ReusableDataTable";
import SearchBar from "../../component/utilitie/SearchBar";
import { Button } from "../../components/ui/button";
import AddTrip from "./AddTrip";
import { API_ROUTE } from "../../../config";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import AddStop from "./AddStop";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "../../../@/components/ui/tooltip"
import { useState } from "react";
import EditTrip from "./EditTrip";
import { useNavigate } from "react-router-dom";

const fetchTrip = async () => {
    try {
        const { data } = await axios.get(`${API_ROUTE}/trips/non-pagination/67bc9002f682d26a7f7a9200`);
        return data;
    } catch (error) {
        console.error("Erreur lors de la récupération des voyages :", error);
        throw new Error("Impossible de récupérer les données du voyage.");
    }
};


export default function Trip() {

    const { data: responseData, isLoading, error } = useQuery({
        queryKey: ["trip"],
        queryFn: fetchTrip,
    });

    const trip = responseData?.data || [];
    console.log("TRIPPPPPPPPPPPP", trip);


    const [dataTrip, setDataTrip] = useState(null)
    const [edit, setEdit] = useState(null)
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const navigate = useNavigate()

    console.log("trip GET GET GET::::::", trip);

    const handleDataTrip = (row) => {
        setDataTrip(row)
    }

    const handleEdit = (row) => {
        setEdit(row)
        console.log("Edit Trip>>>>>>>>", row);
        setOpenEditDialog(true);
    }

    console.log("DATA RECUPERE TRIP", dataTrip);

    const columns = [
        {
            header: "Designation",
            accessorKey: "designation",
        },
        { accessorKey: "tripType", header: "Type trajet" },
        {
            accessorKey: "company.name",
            header: "Compagnie",
            cell: ({ row }) => row.original.company?.name || "N/A",
        },
        { accessorKey: "notes", header: "Bus" },

    ];


    return (
        <div>
            <div className="sm:block hidden">
                <CardDataTable title="Trajet" nmbre={0} />
            </div>

            <div className="mb-3">
                <SearchBar />
            </div>
            <div className="bg-white">
                <ReusableDataTable
                    data={trip}
                    titleDataTable="Trajet"
                    columns={columns}
                    isLoading={isLoading}
                    enablePagination={true}
                    pageSize={4}
                    ComponentButtonAdd={<AddTrip />}
                    customActions={(row) => (
                        <div className="flex items-center space-x-2">

                            <TooltipProvider >
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button size="sm" className="p-2" onClick={() => handleEdit(row)}>
                                            <ClipboardPen size={7} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent >
                                        <p>Modifier</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>


                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" size="sm" className="p-2" onClick={() => navigate(`/trajet/${row._id}`)}>
                                            <EyeClosed size={7} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Détail</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="destructive" size="sm" className="p-2">
                                            <Trash2 size={7} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Supprimer</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            {/* <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span onClick={() => handleDataTrip(row)}><AddStop dataTrip={dataTrip} /></span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Ajouter une station</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider> */}
                        </div>
                    )}
                />
            </div>

            {
                openEditDialog && <EditTrip
                    openDialog={openEditDialog}
                    setOpenDialog={setOpenEditDialog}
                    edit={edit}
                />
            }
        </div>
    )
}
