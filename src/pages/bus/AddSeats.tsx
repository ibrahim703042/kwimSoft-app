import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Ban, BedSingle, DoorOpen, Toilet, Plus, Minus, ChevronsLeftRight } from "lucide-react";
import { Drawer } from "@mui/material";
import volantImg from "../../assets/img/img/volant.png"
import siegeImg from "../../assets/img/img/siege.png"
import ToileteImg from "../../assets/img/img/toillete.png"
import PorteImg from "../../assets/img/img/porte.png"
import PlanImg from "../../assets/img/img/plan.png"
import PlanImgs from "../../assets/img/img/planTwo.png"
import PlanImgse from "../../assets/img/img/planFree.png"
import TelImg from "../../assets/img/img/tle.png"
import axios from "axios";


export default function SeatDesigner() {
    const [state, setState] = useState({ right: false });

    // Dimensions initiales du bus (modifiable)
    const [rows, setRows] = useState(8); // 8 rangées par défaut
    const [cols, setCols] = useState(5); // 5 colonnes par défaut

    // États des sièges et éléments fixes
    const [layout, setLayout] = useState(
        Array.from({ length: rows }, () => Array(cols).fill(null))
    );

    // Mode sélectionné par l'utilisateur
    const [selectedType, setSelectedType] = useState("seat");

    const toggleDrawer = (anchor, open) => () => {
        setState({ ...state, [anchor]: open });
    };

    // Fonction pour modifier la disposition
    const updateLayout = (rowIndex, colIndex) => {
        const newLayout = layout.map((row, r) =>
            row.map((cell, c) => (r === rowIndex && c === colIndex ? selectedType : cell))
        );
        setLayout(newLayout);
    };

    // Ajouter une colonne
    const addColumn = () => {
        setCols(cols + 1);
        setLayout(layout.map(row => [...row, null]));
    };

    // Ajouter une rangée
    const addRow = () => {
        setRows(rows + 1);
        setLayout([...layout, Array(cols).fill(null)]);
    };

    // Supprimer une colonne (min 5 colonnes)
    const removeColumn = () => {
        if (cols > 5) {
            setCols(cols - 1);
            setLayout(layout.map(row => row.slice(0, -1)));
        }
    };

    // Supprimer une rangée (min 8 rangées)
    const removeRow = () => {
        if (rows > 8) {
            setRows(rows - 1);
            setLayout(layout.slice(0, -1));
        }
    };

    const savePlan = async () => {
        try {
            const planData = {
                rows,
                cols,
                layout,
            };

            console.log("planData", planData);
            
            // const response = await axios.post("http://localhost:5000/api/plans", planData);

            if (response.status === 201) {
                alert("Plan enregistré avec succès !");
            }
        } catch (error) {
            console.error("Erreur lors de l'enregistrement du plan :", error);
            alert("Une erreur est survenue lors de l'enregistrement.");
        }
    };

    return (
        <div>
            {/* Bouton pour ouvrir le plan */}
            <Button onClick={toggleDrawer("right", true)}>Modifier le plan</Button>
            <Drawer
                anchor="right"
                open={state.right}
                onClose={toggleDrawer("right", false)}
            >
                <div className="p-5 mx-0">
                    <h2 className="text-sm font-medium mb-1">Dessinez le plan du bus</h2>

                    {/* Sélection du type d'élément à placer */}
                    <div className="flex gap-2 mb-2">
                        <Button onClick={() => setSelectedType("seat")} variant="outline" >
                            <img src={siegeImg} className="w-5 h-5" />
                        </Button>
                        <Button onClick={() => setSelectedType("driver")} variant="outline">
                            <img src={volantImg} className="w-5 h-5" />
                        </Button>
                        <Button onClick={() => setSelectedType("door")} variant="outline">
                            <img src={PorteImg} className="w-7 h-7" />
                        </Button>
                        <Button onClick={() => setSelectedType("toilet")} variant="outline">
                            <img src={ToileteImg} className="w-5 h-5" />
                        </Button>
                        <Button onClick={() => setSelectedType("tele")} variant="outline">
                            <img src={TelImg} className="w-5 h-5" />
                        </Button>
                        <Button onClick={() => setSelectedType(null)} variant="outline">Vide</Button>
                    </div>

                    {/* Boutons pour modifier les dimensions */}
                    <div className="flex gap-2 mb-3">
                        <Button onClick={addColumn} size="small" className="py-2 px-2 text-[0.7rem]" variant="outline">
                            <Plus size={12} /> Col
                        </Button>
                        <Button onClick={removeColumn} disabled={cols <= 5} size="small" className="py-2 px-2 text-[0.7rem]" variant="outline">
                            <Minus size={12} /> Col
                        </Button>
                        <Button onClick={addRow} size="small" className="py-2 px-2 text-[0.7rem]" variant="outline">
                            <Plus size={12} /> Row
                        </Button>
                        <Button onClick={removeRow} disabled={rows <= 8} size="small" className="py-2 px-2 text-[0.7rem]" variant="outline">
                            <Minus size={12} /> Row
                        </Button>
                    </div>

                    {/* Grille interactive */}

                    <div className="relative w-full max-w-4xl mx-auto">
                        <div className="relative w-full">
                            <img src={PlanImgs} alt="" className="w-full h-[700px]" />
                            <div
                                className="absolute top-5 left-0 w-full h-full grid gap-0 py-16 px-[65px]"
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: `repeat(${cols}, 1fr)`,
                                    gridTemplateRows: `repeat(${rows}, 1fr)`,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                {layout.map((row, rowIndex) =>
                                    row.map((cell, colIndex) => (
                                        <div
                                            key={`${rowIndex}-${colIndex}`}
                                            onClick={() => updateLayout(rowIndex, colIndex)}
                                            className="flex items-center justify-center border rounded-lg cursor-pointer transition bg-slate-200 p-1"
                                            style={{
                                                width: `calc(100% / ${cols})`,
                                                height: `calc(100% / ${rows})`,
                                                minWidth: "40px",
                                                minHeight: "40px",
                                            }}
                                        >
                                            {cell === "seat" && <img src={siegeImg} className="w-full h-full object-contain" />}
                                            {cell === "driver" && <img src={volantImg} className="w-full h-full object-contain" />}
                                            {cell === "door" && <img src={PorteImg} className="w-full h-full object-contain" />}
                                            {cell === "toilet" && <img src={ToileteImg} className="w-full h-full object-contain" />}
                                            {cell === "tele" && <img src={TelImg} className="w-full h-full object-contain" />}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    <Button onClick={savePlan} className="mt-4">Enregistrer le plan</Button>


                </div>
            </Drawer>
        </div>
    );
}
