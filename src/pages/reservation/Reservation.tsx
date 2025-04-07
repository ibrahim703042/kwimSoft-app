import { useState } from "react";
import { CheckSquareFill } from "react-bootstrap-icons";
import EnAttente from "./EnAttente";
import AnnulerReservation from "./AnnulerReservation";
import EffectuerReservation from "./EffectuerReservation";


export default function Reservation() {

    const [activeTab, setActiveTab] = useState("effectuer");

    return (
        <div>
            <div className="grid grid-cols-12 gap-2">
                <div className="bg-white col-span-4 rounded-md shadow-sm p-3 py-4">
                    <div className="flex items-center justify-between">
                        <div className="bg-gray-200 rounded-full p-2">
                            <CheckSquareFill color="#0fa821" />
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-medium">2</p>
                            <p className="text-sm text-gray-600 font-extrabold">Effectuer</p>
                            <p className="text-[0.7rem] text-gray-600">Réservation</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white col-span-4 rounded-md shadow-sm p-3 py-4">
                    <div className="flex items-center justify-between">
                        <div className="bg-gray-200 rounded-full p-2">
                            <CheckSquareFill color="#ffbe56" />
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-medium">5</p>
                            <p className="text-sm text-gray-600 font-extrabold">En attente</p>
                            <p className="text-[0.7rem] text-gray-600">Réservation</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white col-span-4 rounded-md shadow-sm p-3 py-4">
                    <div className="flex items-center justify-between">
                        <div className="bg-gray-200 rounded-full p-2">
                            <CheckSquareFill color="#ed4949" />
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-medium">10</p>
                            <p className="text-sm text-gray-600 font-extrabold">Annuler</p>
                            <p className="text-[0.7rem] text-gray-600">Réservation</p>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                {/* Tabs Navigation */}
                <div className="flex rounded-md mt-2">
                    <button
                        className={`px-4 py-[7px] text-[0.8rem] rounded-md ${activeTab === 'effectuer' ? 'bg-[#ffffff] text-black font-medium' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('effectuer')}
                    >
                        Effectuer
                    </button>
                    <button
                        className={`px-4 py-[7px] text-[0.8rem] rounded-md ${activeTab === 'attente' ? 'bg-[#ffffff] text-black font-medium' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('attente')}
                    >
                        En attente
                    </button>
                    <button
                        className={`px-4 py-[7px] text-[0.8rem] rounded-md ${activeTab === 'annuler' ? 'bg-[#ffffff] text-black font-medium' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('annuler')}
                    >
                        Annuler
                    </button>
                </div>

                {/* Tabs Content */}
                <div className="bg-white p-4 mt-3 rounded-md">
                    {activeTab === 'effectuer' && (
                        <EffectuerReservation />
                    )}
                    {activeTab === 'attente' && (
                        <EnAttente />
                    )}
                    {activeTab === 'annuler' && (
                        <AnnulerReservation />
                    )}
                </div>
            </div>
        </div>
    )
}
