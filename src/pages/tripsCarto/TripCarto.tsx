import MapTrip from "../../component/cartoTrip/MapTrip";
import { Search } from "react-bootstrap-icons";
import { Checkbox } from "../../components/ui/checkbox";
import PieChart from "../../component/highcharts/PieChart";
import { Marker } from "react-map-gl";
import MapComponent from "../../component/utilitie/MapComponent";

export default function TripCarto() {
    const trips = [
        "Burundi Kenya",
        "Paris Lyon",
        "Marseille Nice",
        "Lille Bordeaux",
        "Nantes Toulouse",
        "Bruxelles Amsterdam",
        "Berlin Munich",
        "Madrid Barcelone",
        "Rome Florence",
        "Lisbonne Porto"
    ];

    const stats = {
        "Burundi Kenya": 30,
        "Paris Lyon": 15,
        "Marseille Nice": 20,
        "Lille Bordeaux": 10,
        "Nantes Toulouse": 8,
        "Bruxelles Amsterdam": 5,
        "Berlin Munich": 4,
        "Madrid Barcelone": 2,
        "Rome Florence": 3,
        "Lisbonne Porto": 3
    };

    return (
        <div className="text-white min-h-screen grid md:grid-cols-12 gap-1 p-1">
            {/* Section principale (Carte + Données) */}
            <div className="md:col-span-8 flex flex-col gap-2">
                {/* Carte */}
                <div className="flex-1 shadow-lg">
                    <MapComponent />
                </div>

                {/* Données */}
                <div className="h-48 bg-[#ffffff] shadow-md p-4 overflow-y-auto">
                    <h2 className="text-[0.7rem] font-bold mb-2 text-black">📊 Données de trajet</h2>
                    <ul className="space-y-2 text-sm text-[#00000092]">
                        {trips.map((trip, index) => (
                            <li
                                key={index}
                                className="p-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors cursor-pointer"
                            >
                                🚌 {trip}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Panneau latéral */}
            <div className="md:col-span-4 text-[#272727] bg-[#ffffff] shadow-lg">
                <div className="px-3 py-2">
                    <h3 className="text-[0.7rem] font-bold">Gestion de trajet</h3>
                </div>
                <hr />

                {/* Barre de recherche */}
                <div className="px-3 pt-3">
                    <div className="border-[1px] flex items-center justify-between rounded-xl px-3 py-1">
                        <input
                            type="text"
                            placeholder="Veuillez entrer le trajet"
                            className="text-[0.8rem] font-light"
                        />
                        <Search className="text-[#5a5a5a]" />
                    </div>
                </div>

                {/* Liste des trajets */}
                <div className="p-3 mt-2 max-h-60 overflow-auto">
                    <div className="p-0 space-y-2 text-[#000000a7]">
                        {trips.map((trip, index) => (
                            <div
                                key={index}
                                className="px-2 py-[5px] rounded-lg shadow-sm hover:bg-[#00000009] transition-colors"
                            >
                                <div className="flex items-center space-x-2">
                                    <Checkbox id={`trip-${index}`} />
                                    <label
                                        htmlFor={`trip-${index}`}
                                        className="text-[0.8rem] font-medium leading-none"
                                    >
                                        {trip}
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section de la route la plus visitée */}
                <div className="p-3 mt-4">
                    <h3 className="text-[0.7rem] font-bold">🚍 Route la plus visitée</h3>
                    <div className="rounded-lg shadow-sm p-4">
                        <div className="flex items-center space-x-3">
                            {/* Affichage du nom du trajet */}
                            <p className="text-[0.8rem] font-medium text-[#1a202c]">Burundi Kenya</p>
                            {/* Affichage du pourcentage */}
                            <p className="text-sm text-[#ed4e4e]">{stats["Burundi Kenya"]}% de fréquentation</p>
                        </div>

                        {/* Graphique circulaire */}
                        <div className="mt-0">
                            <PieChart />
                        </div>
                    </div>
                </div>
            </div>




        </div>
    );
}
