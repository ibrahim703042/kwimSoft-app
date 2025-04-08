import { useState } from "react";
import EnAttente from "./EnAttente";
import AnnulerReservation from "./AnnulerReservation";
import EffectuerReservation from "./EffectuerReservation";

export default function Reservation() {
    const [activeTab, setActiveTab] = useState("effectuer");

    return (
        <div>
            {activeTab === "effectuer" && <EffectuerReservation />}
            {activeTab === "attente" && <EnAttente />}
            {activeTab === "annuler" && <AnnulerReservation />}
        </div>
    );
}