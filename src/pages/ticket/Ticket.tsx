import { ClipboardPen, EyeClosed, Trash2 } from "lucide-react";
import CardDataTable from "../../component/carddataTable/CardDataTable";
import { ReusableDataTable } from "../../component/utilitie/ReusableDataTable";
import SearchBar from "../../component/utilitie/SearchBar";
import { Button } from "../../components/ui/button";


export default function Ticket() {

    const Columns = [
        {
            accessorKey: "NOM_BATEAUX",
            header: "No ticket",
        },
        {
            accessorKey: "Adresse",
            header: "Statut",
        },
        {
            accessorKey: "NUMERO_IMMATRICULATION",
            header: "Prix",
        },
        {
            accessorKey: "Email",
            header: "Date",
        },
        // {
        //   accessorKey: "ANNEE_CONSTRUCTION",
        //   header: "Construction",
        //   cell: ({ row }) => {
        //     const date = new Date(row.getValue("ANNEE_CONSTRUCTION"));
        //     return <span>{date.toLocaleDateString("fr-FR")}</span>;
        //   },
        // },
    ];

    return (
        <div>
            <CardDataTable title="Ticket" nmbre={0} />

            <div className="mb-3">
                <SearchBar />
            </div>

            <div className="bg-white">
                <ReusableDataTable
                    data={[]}
                    titleDataTable="Ticket"
                    columns={Columns}
                    // ComponentButtonAdd={<AddDriver />}
                    enablePagination={true}
                    customActions={(row) => (
                        <div className="flex items-center space-x-4">
                            <Button className="text-[0.6rem] py-[5px] px-3" size="50">
                                <ClipboardPen />
                            </Button>
                            <Button
                                variant="destructive"
                                className="text-[0.6rem] py-[5px] px-3"
                                size="50"
                            >
                                <Trash2 />
                            </Button>
                            <Button
                                variant="outline"
                                className="text-[0.6rem] py-[5px] px-3"
                                size="50"
                            >
                                <EyeClosed />
                            </Button>
                        </div>
                    )}
                />

            </div>
        </div>
    )
}
