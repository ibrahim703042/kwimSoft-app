import { useState, useRef, useEffect } from "react";
import Map, { NavigationControl, GeolocateControl, Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import stationImg from "../../assets/img/img/station.png";

const TOKEN = "pk.eyJ1IjoibWFydGlubWJ4IiwiYSI6ImNrMDc0dnBzNzA3c3gzZmx2bnpqb2NwNXgifQ.D6Fm6UO9bWViernvxZFW_A";

export default function MapComponentDyn({ stations, height = "400px", selectedStation, setSelectedStation }) {
    // const [selectedStation, setSelectedStation] = useState(null);
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
    const mapRef = useRef(null);

    // Centrer la carte sur la station sélectionnée
    useEffect(() => {
        if (selectedStation && mapRef.current) {
            mapRef.current.flyTo({
                center: [selectedStation.locations.coordinates[0], selectedStation.locations.coordinates[1]],
                zoom: 14,
                essential: true,
            });
        }
    }, [selectedStation]);

    const handleOpenModal = (event, station) => {
        const rect = event.target.getBoundingClientRect(); // Récupère les coordonnées de l'élément
        setModalPosition({
            top: rect.top + window.scrollY - 100, // Décale légèrement au-dessus du marqueur
            left: rect.left + window.scrollX - -20,
        });
        setSelectedStation(station);
    };

    const handleCloseModal = () => {
        setSelectedStation(null);
    };

    return (
        <div className="w-full relative" style={{ height }}>
            <Map
                ref={mapRef}
                initialViewState={{
                    latitude: stations.length > 0 ? stations[0].locations.coordinates[1] : -3.3792,
                    longitude: stations.length > 0 ? stations[0].locations.coordinates[0] : 29.3640,
                    zoom: 12,
                }}
                mapStyle="mapbox://styles/mapbox/streets-v12"
                mapboxAccessToken={TOKEN}
                style={{ width: "100%", height: "100%" }}
            >
                <NavigationControl position="top-right" />
                <GeolocateControl position="top-right" />

                {stations.map((station) => (
                    <Marker
                        key={station._id}
                        latitude={station.locations.coordinates[1]}
                        longitude={station.locations.coordinates[0]}
                    >
                        <img
                            src={stationImg}
                            alt={`Station ${station.name}`}
                            width={30}
                            height={30}
                            className="cursor-pointer transition-transform duration-200 hover:scale-125"
                            onClick={(e) => handleOpenModal(e, station)}
                        />
                    </Marker>
                ))}
            </Map>

            {/* MODAL CENTRÉ SUR LE MARQUEUR */}
            <Dialog open={!!selectedStation} onOpenChange={handleCloseModal}>
                <DialogContent
                    className="fixed p-0"
                    style={{
                        top: `${modalPosition.top}px`,
                        left: `${modalPosition.left}px`,
                        transform: "translate(-50%, -50%)",
                    }}
                >
                    <DialogHeader>
                        <DialogTitle className="bg-[#0f123f] text-white p-3 rounded-t-lg text-center">
                            {selectedStation?.state || "CDS Test"}
                        </DialogTitle>
                    </DialogHeader>

                    <div>
                        <table className="w-full text-center">
                            <thead>
                                <tr className="border-b mx-3">
                                    <th className="text-xs pb-1">Nom</th>
                                    <th className="text-xs pb-1">Ville</th>
                                    <th className="text-xs pb-1">Pays</th>

                                </tr>
                            </thead>
                            <tbody className="text-center">
                                <tr className="">
                                    <td className="text-xs pt-1">{selectedStation?.name}</td>
                                    <td className="text-xs pt-1">{selectedStation?.city}</td>
                                    <td className="text-xs pt-1">{selectedStation?.country}</td>

                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="mb-4 px-5">
                        <div onClick={handleCloseModal} className="w-full mt-0 text-center border my-2 py-1 rounded-md">
                            Fermer
                        </div>
                    </div>

                    <div className="absolute z-0 bottom-0 left-0 right-0 flex justify-center items-center p-0">
                        <div className="bg-white w-7 rotate-45 h-7 flex justify-center absolute items-center text-white">

                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
