import axios from "axios";
import { BookmarkIcon, BookmarkPlusIcon, Eye } from "lucide-react";
import { EnvelopeFill, TelephoneFill } from "react-bootstrap-icons";
import { useParams } from "react-router-dom";
import { API_ROUTE } from "../../../config";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from "../../components/ui/dialog";
import MapTrip from "../../component/cartoTrip/MapTrip";
import { Marker } from "react-map-gl";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { setBreadCrumbItemsAction } from "../../store/actions/appActions";
import { compagny_routes_items } from "../../routes/compagny/compagny_routes";



const fetchCompagnie = async (id) => {
    const { data } = await axios.get(`${API_ROUTE}/companies/${id}`);
    return data;
};

export default function ViewCompagny() {

    const { id } = useParams<{ id: string }>();
    const dispatch: Dispatch<any> = useDispatch();

    const { data: compagnie, isLoading, error } = useQuery({
        queryKey: ["compagnie", id],
        queryFn: () => fetchCompagnie(id),
    });

    const compagn = compagnie?.data || {};
    console.log("driverdriverdriver", compagn);
    // {compagn?.transportLicenseExpiry}

    const formattedDate = new Date(compagn?.transportLicenseExpiry).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    const formattedDateCreer = new Date(compagn?.createdAt).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    const formattedDateExperite = new Date(compagn?.insurance?.expiryDate).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    console.log("++++++++++++++++++++++++++=", compagn?.certifications);

      useEffect(() => {
            dispatch(setBreadCrumbItemsAction([
                compagny_routes_items.view
            ]));
            return () => {
                dispatch(setBreadCrumbItemsAction([]));
            };
        }, [dispatch]);

    return (
        <div>
            <div>
                <div className="grid grid-cols-1 md:grid-cols-12 md:space-x-3">
                    <div className="col-span-8 bg-background rounded-md px-2 shadow-sm">
                        <div className="flex gap-3 pt-2">
                            <div className="w-56 flex items-center justify-center">
                                <img src={compagn?.logo} alt="Company Logo" className="rounded-lg shadow-md" />
                            </div>
                            <div className="flex justify-between w-full">
                                <div>
                                    <div className="flex gap-3 items-center">
                                        <div>
                                            <p className="text-[1.3rem] font-semibold m-0 p-0">
                                                {compagn?.name}
                                            </p>
                                        </div>
                                        {/* <div className="flex items-center sm:flex hidden"> */}
                                        <div className="hidden sm:flex items-center text-[0.8rem]">
                                            Status
                                            <p className="text-[0.8rem] mx-1 font-medium">{compagn?.isActive === true ? "active" : "desabled"}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 items-center pt-2">
                                        <EnvelopeFill />
                                        <p className="text-[0.9rem] text-[#969696]">
                                            {compagn?.email}
                                        </p>
                                    </div>

                                    <div className="flex gap-2 items-center pt-0">
                                        <TelephoneFill />
                                        <p className="text-[0.9rem] text-[#969696]">
                                            {compagn?.phone}
                                        </p>
                                    </div>

                                    <div className="flex gap-1 items-center pt-2 text-[0.8rem]">
                                        Numéro de licence
                                        <p className="text-[0.8rem] text-[#969696]">
                                            {compagn?.transportLicenseNumber}
                                        </p>
                                    </div>
                                    <div className="flex gap-1 items-center pt-0 text-[0.8rem]">
                                        Expiration de licence
                                        <p className="text-[0.8rem] text-red-500">
                                            {formattedDate}
                                        </p>
                                    </div>
                                    <div className="flex gap-1 items-center pt-0 text-[0.8rem]">
                                        Total bus
                                        <p className="text-[0.9rem] font-medium">
                                            : {compagn?.totalBus}
                                        </p>
                                    </div>

                                    <div className="pt-4 flex items-center gap-2">
                                        <div>
                                            <p className="text-[0.8rem]"> Date de création </p>
                                        </div>
                                        <div className="pt-0">
                                            <p className="text-[0.8rem]">{formattedDateCreer}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-12 pt-3">
                                        <div className="col-span-9 border px-3 py-1">
                                            <p className="text-sm font-medium">Certificat</p>
                                        </div>
                                        <div className="col-span-3 border px-3 py-1">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <p className="text-sm flex cursor-pointer justify-center items-center pt-[2px]">
                                                        <Eye color="black" size={15} />
                                                    </p>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[800px]">
                                                    <DialogHeader className={undefined}>
                                                        <DialogDescription>
                                                            Mes certificat
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="grid gap-4 py-4">
                                                        <div className="overflow-x-auto">
                                                            <table className="min-w-full bg-white border border-gray-300">
                                                                <thead>
                                                                    <tr className="bg-gray-200 text-gray-700 text-[0.8rem]">
                                                                        <th className="border px-4 py-2">Nom</th>
                                                                        <th className="border px-4 py-2">Numéro</th>
                                                                        <th className="border px-4 py-2">Émetteur</th>
                                                                        <th className="border px-4 py-2">Date d'Obtention</th>
                                                                        <th className="border px-4 py-2">Expiration</th>
                                                                        <th className="border px-4 py-2">Statut</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {Array.isArray(compagn?.certifications) && compagn?.certifications.length > 0 ? (
                                                                        compagn?.certifications.map((cert, index) => (
                                                                            <tr key={index} className="text-center border-b text-[0.8rem]">
                                                                                <td className="border px-4 py-2">{cert.name}</td>
                                                                                <td className="border px-4 py-2">{cert.number}</td>
                                                                                <td className="border px-4 py-2">{cert.issuer}</td>
                                                                                <td className="border px-4 py-2">{new Date(cert.obtainedDate).toLocaleDateString()}</td>
                                                                                <td className="border px-4 py-2">{new Date(cert.expiryDate).toLocaleDateString()}</td>
                                                                                <td className={`border px-4 py-2 font-bold ${cert.status === "ACTIVE" ? "text-green-500" : "text-red-500"}`}>
                                                                                    {cert.status}
                                                                                </td>
                                                                            </tr>
                                                                        ))
                                                                    ) : (
                                                                        <tr>
                                                                            <td className="text-center py-4">Aucune certification disponible</td>
                                                                        </tr>
                                                                    )}
                                                                </tbody>


                                                            </table>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </div>
                                </div>

                                <div className="hidden sm:block">
                                    <div className="flex items-center">

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
                                        Pays
                                    </p>
                                </div>
                                <p className="text-[0.8rem] text-foreground font-bold leading-tight">
                                    {compagn?.country?.name?.common}
                                </p>
                            </div>

                            <div className="bg-muted rounded-sm p-1 col-span-6 space-y-1">
                                <div className="flex items-center">
                                    <BookmarkIcon />
                                    <p className="text-[0.8rem] text-foreground leading-tight">
                                        Ville
                                    </p>
                                </div>
                                <p className="text-[0.8rem] text-blck font-bold leading-tight">
                                    {compagn?.address?.city}
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
            </div>
            <div className="bg-white mt-2 p-4 shadow-md rounded-lg">
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-6">
                        <p className="text-sm font-semibold mb-2">Adresse complète :</p>
                        <p className="text-sm mb-1"><span className="font-medium">Complément : </span>{compagn?.address?.complement}</p>
                        <p className="text-sm mb-1"><span className="font-medium">Code postal : </span>{compagn?.address?.postalCode}</p>
                        <p className="text-sm mb-1"><span className="font-medium">Rue : </span>{compagn?.address?.street}</p>
                    </div>
                    <div className="col-span-6">
                        <div className="pb-2">
                            <p className="text-sm font-semibold mb-2">Assurance :</p>
                            <p className="text-sm mb-1"><span className="font-medium">Date d'expiration : </span>{formattedDateExperite}</p>
                            <p className="text-sm mb-1"><span className="font-medium">Numéro de police : </span>{compagn?.insurance?.policyNumber}</p>
                            <p className="text-sm mb-1"><span className="font-medium">Fournisseur : </span>{compagn?.insurance?.provider}</p>
                        </div>
                        <MapTrip latitude={-3.3792} longitude={29.3640} zoom={16} showNavigation={true}>
                            <Marker latitude={-3.3792} longitude={29.3640} color="red" />
                        </MapTrip>
                    </div>
                </div>

                <div className="mt-2">
                    <p className="text-sm font-semibold mb-1">Type de transport :</p>
                    {compagn?.transportScope?.map((item, index) => (
                        <p key={index} className="text-[0.8rem] font-medium mb-1">{item}</p>
                    ))}
                </div>

                <div className="mt-2">
                    <p className="text-sm font-semibold mb-2">Description :</p>
                    <p className="text-sm mb-1">{compagn?.description}</p>
                </div>

                <div className="mt-2">
                    <p className="text-sm font-semibold">Site web :</p>
                    <p className="text-sm text-blue-500 underline">{compagn?.website}</p>
                </div>
            </div>
        </div>
    )
}
