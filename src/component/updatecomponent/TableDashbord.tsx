import React from "react";
import { ChevronDown, Banknote } from "lucide-react";

export default function TableDashbord() {
  return (
    <div>
      {/* Conteneur du tableau */}
      <div className="grid grid-cols-12 gap-3 mt-3 items-center text-[0.8rem]">
        {/* Date */}
        <div className="col-span-4 sm:col-span-2">
          <p className="font-medium">20/11/2014</p>
        </div>

        {/* Nom */}
        <div className="col-span-4 text-end sm:text-start sm:col-span-2">
          <p className="font-medium">Dalker Lor</p>
        </div>

        {/* Classe */}
        <div className="hidden sm:block sm:col-span-2">Class I</div>

        {/* Paiement */}
        <div className="col-span-6 sm:col-span-3 flex items-center gap-1">
          <Banknote size={16} />
          <p>Waangu payment hub</p>
        </div>

        {/* Montant */}
        <div className="col-span-4 sm:col-span-2">15.00 $</div>

        {/* Bouton d'action */}
        <div className="col-span-2 sm:col-span-1 flex justify-end">
          <ChevronDown size={16} />
        </div>
      </div>

      {/* Séparateur */}
      <hr className="my-2" />
    </div>
  );
}
