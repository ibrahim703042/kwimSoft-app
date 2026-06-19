import { useState, useRef, useEffect, type KeyboardEvent, type MouseEvent } from "react";
import Map, { NavigationControl, GeolocateControl, Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import stationImg from "../../assets/img/img/station.png";
import { MAP_KEYS } from "@kwim/config";

const TOKEN = MAP_KEYS.mapbox;

interface Station {
  _id: string;
  name?: string;
  city?: string;
  country?: string;
  state?: string;
  locations: { coordinates: [number, number] };
}

interface MapComponentDynProps {
  readonly stations: Station[];
  readonly height?: string;
  readonly selectedStation: Station | null;
  readonly setSelectedStation: (station: Station | null) => void;
}

export default function MapComponentDyn({
  stations,
  height = "400px",
  selectedStation,
  setSelectedStation,
}: Readonly<MapComponentDynProps>) {
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const mapRef = useRef(null);

  useEffect(() => {
    if (selectedStation && mapRef.current) {
      mapRef.current.flyTo({
        center: [selectedStation.locations.coordinates[0], selectedStation.locations.coordinates[1]],
        zoom: 14,
        essential: true,
      });
    }
  }, [selectedStation]);

  const handleOpenModal = (event: MouseEvent<HTMLButtonElement>, station: Station) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setModalPosition({
      top: rect.top + globalThis.scrollY - 100,
      left: rect.left + globalThis.scrollX + 20,
    });
    setSelectedStation(station);
  };

  const handleCloseModal = () => {
    setSelectedStation(null);
  };

  const handleMarkerKeyDown = (event: KeyboardEvent<HTMLButtonElement>, station: Station) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleOpenModal(event as unknown as MouseEvent<HTMLButtonElement>, station);
    }
  };

  return (
    <div className="w-full relative" style={{ height }}>
      <Map
        ref={mapRef}
        initialViewState={{
          latitude: stations.length > 0 ? stations[0].locations.coordinates[1] : -3.3792,
          longitude: stations.length > 0 ? stations[0].locations.coordinates[0] : 29.364,
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
            <button
              type="button"
              className="cursor-pointer border-0 bg-transparent p-0 transition-transform duration-200 hover:scale-125"
              onClick={(e) => handleOpenModal(e, station)}
              onKeyDown={(e) => handleMarkerKeyDown(e, station)}
              aria-label={`Station ${station.name ?? ""}`}
            >
              <img
                src={stationImg}
                alt=""
                width={30}
                height={30}
              />
            </button>
          </Marker>
        ))}
      </Map>

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
                <tr>
                  <td className="text-xs pt-1">{selectedStation?.name}</td>
                  <td className="text-xs pt-1">{selectedStation?.city}</td>
                  <td className="text-xs pt-1">{selectedStation?.country}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mb-4 px-5">
            <button
              type="button"
              onClick={handleCloseModal}
              className="w-full mt-0 text-center border my-2 py-1 rounded-md"
            >
              Fermer
            </button>
          </div>

          <div className="absolute z-0 bottom-0 left-0 right-0 flex justify-center items-center p-0">
            <div className="bg-white w-7 rotate-45 h-7 flex justify-center absolute items-center text-white" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
