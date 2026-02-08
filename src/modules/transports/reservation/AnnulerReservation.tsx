import { ClipboardPen, EyeClosed } from "lucide-react";
import { ReusableDataTable } from "@/components/utilitie/ReusableDataTable";
import { Button } from "@/components/ui/button";
import { Trash2 } from "react-bootstrap-icons";
import { ColumnDef } from "@tanstack/react-table";

interface ReservationData {
    name: string;
    country?: {
        name?: {
            common?: string;
        };
    };
    totalBus?: number;
    transportLicenseNumber?: string;
}

export default function AnnulerReservation() {
    const columns: ColumnDef<ReservationData>[] = [
        { accessorKey: "name", header: "Nom" },
        { accessorKey: "country.name.common", header: "compagnie" },
        { 
            accessorKey: "totalBus", 
            header: () => <span className="whitespace-nowrap">Bus</span> 
        },
        { 
            accessorKey: "transportLicenseNumber", 
            header: "Date", 
            cell: (info) => <span className="whitespace-nowrap">{info.getValue() as string}</span> 
        },
    ];

    return (
        <div>
            <ReusableDataTable
                data={[]}
                titleDataTable="Réservation annuler"
                columns={columns}
                ComponentButtonAdd=""
                enablePagination={true}
                customActions={() => (
                    <div className="flex items-center space-x-4">
                        <Button className="text-[0.6rem] py-[5px] px-3" size="sm">
                            <ClipboardPen />
                        </Button>
                        <Button
                            variant="destructive"
                            className="text-[0.6rem] py-[5px] px-3"
                            size="sm"
                        >
                            <Trash2 />
                        </Button>
                        <Button
                            variant="outline"
                            className="text-[0.6rem] py-[5px] px-3"
                            size="sm"
                        >
                            <EyeClosed />
                        </Button>
                    </div>
                )}
            />
        </div>
    )
}
