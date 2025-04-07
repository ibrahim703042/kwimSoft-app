import { useParams } from "react-router-dom"
import { API_ROUTE, API_ROUTE_PASSWORD } from "../../../config";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { CalendarCheck, EnvelopeFill,GeoAltFill, TelephoneFill } from "react-bootstrap-icons";
import { BookmarkIcon, BookmarkPlusIcon } from "lucide-react";
import hommeImg from "../../assets/img/img/homme.jpg"

const fetchDriver = async (id) => {
    const { data } = await axios.get(`${API_ROUTE_PASSWORD}/drivers/${id}`);
    return data;
};


export default function ViewDriver() {

    const { id } = useParams()

    const { data: driver, isLoading, error } = useQuery({
        queryKey: ["bus", id],
        queryFn: () => fetchDriver(id),
    });

    const drivers = driver?.data || {};
    console.log("driverdriverdriver", drivers);

    const formattedDate = new Date(drivers?.licenseExpiration).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    const formattedBirth = new Date(drivers?.birthDate).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    const formattedInsert = new Date(drivers?.updatedAt).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-12 md:space-x-3">
                <div className="col-span-8 bg-background rounded-md px-2 shadow-sm">
                    <div className="flex gap-3 pt-2">
                        <div className="w-56 h-auto">
                            <img src={drivers?.image} alt="" width="100%" height="100%" />
                        </div>
                        <div className="flex justify-between w-full">
                            <div>
                                <div className="flex gap-3 items-center">
                                    <div>
                                        <p className="text-[1.3rem] font-semibold m-0 p-0">
                                            {drivers?.firstName}  {drivers?.lastName}
                                        </p>
                                    </div>
                                    {/* <div className="flex items-center sm:flex hidden"> */}
                                    <div className="hidden sm:flex items-center text-[0.8rem]">
                                        Status
                                        <p className="text-[0.8rem] mx-1 font-semibold">{drivers?.availability?.status}</p>
                                    </div>
                                </div>

                                <div className="flex gap-2 items-center pt-2">
                                    <EnvelopeFill />
                                    <p className="text-[0.9rem] text-[#969696]">
                                        {drivers?.email}
                                    </p>
                                </div>

                                <div className="flex gap-2 items-center pt-0">
                                    <TelephoneFill />
                                    <p className="text-[0.9rem] text-[#969696]">
                                        {drivers?.phoneNumber}
                                    </p>
                                </div>

                                <div className="flex gap-1 items-center pt-2 text-[0.8rem]">
                                    Numéro de licence
                                    <p className="text-[0.8rem] text-[#969696]">
                                        {drivers?.licenseNumber}
                                    </p>
                                </div>
                                <div className="flex gap-1 items-center pt-0 text-[0.8rem]">
                                    Expiration de licence
                                    <p className="text-[0.8rem] text-red-500">
                                        {formattedDate}
                                    </p>
                                </div>

                                <div className="pt-4 flex items-center gap-2">
                                    <div>
                                        <p className="text-[0.8rem]"> Date de naissance </p>
                                    </div>
                                    <div className="pt-0">
                                        <p className="text-[0.8rem]"> {formattedBirth} </p>
                                    </div>
                                </div>
                            </div>

                            <div className="hidden sm:block">
                                <div className="flex items-center">
                                    <BookmarkIcon />
                                    <p className="text-[0.8rem] text-[#969696]">
                                        {drivers?.availability?.status}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-4 bg-background rounded-md p-2 md:mt-0 mt-3 shadow-sm">
                    <div className="p-0 rounded-sm grid grid-cols-12 gap-2">
                        <div className="bg-muted rounded-sm p-1 col-span-12 space-y-1">
                            <div className="flex items-center">
                                <BookmarkIcon />
                                <p className="text-[0.8rem] text-foreground leading-tight">
                                    Statut juridique
                                </p>
                            </div>
                            <p className="text-[0.8rem] text-foreground font-bold leading-tight">
                                oiuytrewertyu
                            </p>
                        </div>

                        <div className="bg-muted rounded-sm p-1 col-span-6 space-y-1">
                            <div className="flex items-center">
                                <BookmarkIcon />
                                <p className="text-[0.8rem] text-foreground leading-tight">
                                    Date insertion
                                </p>
                            </div>
                            <p className="text-[0.8rem] text-blck font-bold leading-tight">
                                {formattedInsert}
                            </p>
                        </div>

                        <div className="bg-muted rounded-sm p-1 col-span-6 space-y-1">
                            <div className="flex items-center">
                                <BookmarkIcon />
                                <p className="text-[0.8rem] text-foreground leading-tight">
                                    Province
                                </p>
                            </div>
                            <p className="text-[0.8rem] text-foreground font-bold leading-tight">
                                oiuytre
                            </p>
                        </div>

                        <div className="bg-muted rounded-sm p-1 col-span-6 space-y-1">
                            <div className="flex items-center">
                                <BookmarkIcon />
                                <p className="text-[0.8rem] text-foreground leading-tight">
                                    Commune
                                </p>
                            </div>
                            <p className="text-[0.8rem] text-foreground font-bold leading-tight">
                                oiuytre
                            </p>
                        </div>
                        <div className="bg-muted rounded-sm p-1 col-span-6 space-y-1">
                            <div className="flex items-center">
                                <BookmarkPlusIcon />
                                <p className="text-[0.8rem] text-foreground leading-tight">
                                    Zone
                                </p>
                            </div>
                            <p className="text-[0.8rem] text-foreground font-bold leading-tight">
                                kjhgfds
                            </p>
                        </div>
                    </div>

                    <div>
                        <div className="bg-muted rounded-sm p-1 col-span-12 space-y-1 mt-2 flex items-center justify-between">
                            <div>
                                <p className="text-[0.8rem] text-foreground py-1 leading-tight">
                                    Colline
                                </p>
                                <p className="text-[0.8rem] text-foreground py-1 leading-tight font-bold">
                                    {" "}
                                    oiugfd
                                </p>
                            </div>
                            <BookmarkIcon />
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 md:space-x-3 bg-background mt-2 space-x-5">
                <div className="col-span-8">
                   
                </div>

                <div className="col-span-4 px-2 py-2 pb-5">
                    <div className="pt-2">
                        <p className="font-medium">Compagnie</p>
                        <p className="text-[0.8rem]">{drivers?.company?.name}</p>
                    </div>

                    <div className="flex items-center pt-3 gap-2">
                        NIF
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                        {/* <OpenWithIcon /> */}
                        <p className="text-[0.8rem]">Date création</p>
                    </div>

                    <div className="flex items-center space-x-5 pt-2 pl-1">
                        <CalendarCheck />
                        <p className="text-[0.8rem]"> 05-12-2023, there are 344 days</p>
                    </div>

                    <hr className="my-3" />
                    <div className="flex items-center space-x-5 pt-0">
                        <GeoAltFill className="text-[1.3rem]" />
                        <p className="text-[0.8rem]"> GITEGA-GIHETA-Kabanga</p>
                    </div>

                </div>
            </div>

        </div>
    )
}
