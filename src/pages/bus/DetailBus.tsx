import { useEffect, useRef, useState } from "react";
import busImg from "../../assets/img/img/bus.webp"
import mapboxgl from 'mapbox-gl';
import logoAsyst from "../../assets/img/img/logoAsyst.png"
import femme from "../../assets/img/img/femme.jpg"
import { useParams } from "react-router-dom";
import { API_ROUTE } from "../../../config";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";


mapboxgl.accessToken = 'pk.eyJ1IjoibWFydGlubWJ4IiwiYSI6ImNrMDc0dnBzNzA3c3gzZmx2bnpqb2NwNXgifQ.D6Fm6UO9bWViernvxZFW_A';


const fetchBus = async (id) => {
    const { data } = await axios.get(`${API_ROUTE}/buses/${id}`);
    return data;
};


export default function DetailBus() {

    const mapContainer = useRef(null);
    const { id } = useParams();
    console.log("iddddddddddd", id);

    const { data: seats, isLoading, error } = useQuery({
        queryKey: ["seats", id],
        queryFn: () => fetchBus(id),
    });
   
    console.log("LLLLLLLLLLLLLLLLLL", seats);
    const buse = seats?.data || {};
    console.log("PPPPPPPPPPPPPPPPPPPPPPP>>>>>>>>>>>.", buse);
    

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [29.3542, -3.3614], // Coordonnées de Bujumbura
            zoom: 12
        });

        // Ajouter un marqueur à la localisation
        new mapboxgl.Marker()
            .setLngLat([29.3542, -3.3614])
            .setPopup(new mapboxgl.Popup().setHTML('<h4>Asyst</h4><p>Bujumbura Gihosha 13 rue</p>'))
            .addTo(map);

        return () => map.remove();
    }, []);

    return (
        <div>
            <div className="grid grid-cols-12 bg-[#ffffff]">
                <div className="col-span-4 p-4 px-10">
                    <div>
                        <p className="text-md font-semibold">{buse?.brand}</p>
                    </div>
                    <div className="pt-2 grid grid-cols-12 gap-5">
                        <div className="col-span-6">
                            <p className="text-[0.8rem] leading-tight text-[#00000098]">Kilométrage</p>
                            <p className="text-xl font-medium leading-tight">{buse?.mileage} Km</p>
                        </div>
                        <div className="col-span-6">
                            <p className="text-[0.8rem] leading-tight text-[#00000098]">Modèle</p>
                            <p className="text-xl font-medium leading-tight">{buse?.modele}</p>
                        </div>
                        <div className="col-span-6">
                            <p className="text-[0.8rem] leading-tight text-[#00000098]">Nombre de places</p>
                            <p className="text-xl font-medium leading-tight">{buse?.totalSeats} places</p>

                            <div className="pt-2">
                                <p className="text-[0.8rem] text-[#00000098]">Nom du fabricant</p>
                                <p className="text-[0.8rem]">{buse?.manufacture}</p>
                                <p className="text-[0.8rem] pt-2 text-[#00000098]">VIN</p>
                                <p className="text-[0.8rem]">{buse?.vin}</p>
                            </div>
                        </div>
                        <div className="col-span-6">
                            <p className="text-[0.8rem] leading-tight text-[#00000098]">Année</p>
                            <p className="text-xl font-medium leading-tight">{buse?.year}</p>
                            <div className="pt-2">
                                <p className="text-[0.8rem] text-[#00000098]">Couleur</p>
                                <p className="text-[0.8rem]">{buse?.color}</p>
                                <p className="text-[0.8rem] pt-2 text-[#00000098]">Date maintenance</p>
                                <p className="text-[0.8rem]">
                                    {buse?.lastMaintenanceDate
                                        ? new Date(buse?.lastMaintenanceDate).toLocaleDateString()
                                        : 'N/A'}
                                </p>
                            </div>
                        </div>

                        <div className="col-span-12 flex items-center justify-between">
                            <div className="border inline-block mt-0 px-3 py-[3px] rounded-md">
                                <p className="text-[0.7rem]">Plaque</p>
                                <p className="font-semibold">{buse?.licensePlate}</p>
                            </div>
                            <div className="pt-0">
                                <p className="text-[0.8rem]">Statut :
                                    <span className="font-medium"> {buse?.status}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Image du bus */}
                <div className="col-span-8">
                    <div className="flex justify-end">
                        <img src={buse?.image} alt="Bus" className="w-[500px]" />
                    </div>
                </div>
            </div>

            {/* Section Compagnie et Conducteur */}
            <div className="mt-2">
                <div className="grid grid-cols-12 gap-1">
                    {/* Compagnie */}
                    <div className="col-span-6 bg-white p-4">
                        <p className="font-medium text-md text-[#494949]">Compagnie</p>
                        <div className="pt-2">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold">{buse?.company?.name}</p>
                                    <p className="text-sm">Bujumbura Gihosha 13 rue</p>
                                </div>
                                <div className="h-8 w-20">
                                    <img src={logoAsyst} alt="Logo Compagnie" />
                                </div>
                            </div>
                            <div className="mt-2 h-36" ref={mapContainer}></div>
                        </div>
                    </div>

                    {/* Conducteur */}
                    <div className="col-span-6 bg-white p-4">
                        <p className="font-semibold px-2 text-[0.8rem]">Conducteur</p>
                        <div className="flex gap-2">
                            <div className="h-28 w-28 bg-slate-300">
                                <img src={femme} alt="Conducteur" className="w-full h-full object-cover" />
                            </div>

                            <div className="flex gap-7 w-full">
                                <div>
                                    <div>
                                        <p className="text-[0.8rem] font-semibold text-[#00000098]">Conducteur</p>
                                        <p className="text-[0.8rem]">
                                            {
                                                `${buse?.driver?.firstName} ${buse?.driver?.lastName}`
                                            }
                                        </p>
                                    </div>
                                    <div className="pt-1">
                                        <p className="text-[0.8rem] font-semibold text-[#00000098]">Âge</p>
                                        <p className="text-[0.8rem]">25 ans</p>
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <p className="text-[0.8rem] font-semibold text-[#00000098]">Service</p>
                                        <p className="text-[0.8rem]">
                                            {buse?.isApproved ? 'Approuvé' : 'En attente'}

                                        </p>
                                    </div>
                                    <div className="pt-1">
                                        <p className="text-[0.8rem] font-semibold text-[#00000098]">Email</p>
                                        <p className="text-[0.8rem]">CeforaNkunlu.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Appréciation */}
                        <div className="flex-1 pt-3">
                            <p className="text-[0.7rem] font-semibold text-[#00000098] mb-1">Appréciation</p>
                            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-[#191C21]" style={{ width: '40%' }}></div>
                            </div>
                        </div>

                        {/* Aptitude à la conduite */}
                        <div className="flex-1 pt-3">
                            <p className="text-[0.7rem] font-semibold text-[#00000098] mb-1">Aptitude à la conduite</p>
                            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-[#191C21]" style={{ width: '80%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
