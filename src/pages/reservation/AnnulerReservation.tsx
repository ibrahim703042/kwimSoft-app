import { ClipboardPen, EyeClosed } from "lucide-react";
import { ReusableDataTable } from "../../component/utilitie/ReusableDataTable";
import { Button } from "../../components/ui/button";
import { Trash2 } from "react-bootstrap-icons";


export default function AnnulerReservation() {
    const columns = [
        { accessorKey: "name", header: "Nom" },
        { accessorKey: "country.name.common", header: "compagnie" },
        { accessorKey: "totalBus", header: <span className="whitespace-nowrap">Bus</span> },
        { accessorKey: "transportLicenseNumber", header: "Date", cell: (info) => <span className="whitespace-nowrap">{info.getValue()}</span> },
    ];


    return (
        <div>
            <ReusableDataTable
                data={[]}
                titleDataTable="Réservation annuler"
                columns={columns}
                ComponentButtonAdd=""
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
    )
}
