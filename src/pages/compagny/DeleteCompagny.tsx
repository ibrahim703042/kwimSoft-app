import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ROUTE } from "../../../config";
import { Button } from "../../components/ui/button";


export default function DeleteCompagny(): JSX.Element {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            await axios.delete(`${API_ROUTE}/companies/${id}`);
            alert("Compagnie supprimée avec succès !");
            navigate("/compagnies");
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
            alert("Échec de la suppression.");
        }
    };

    return (
        <div className="p-5">
            <h1 className="text-xl font-bold mb-4">Supprimer la Compagnie {id} ?</h1>
            <div className="flex space-x-4">
                <Button className="bg-red-600 text-white" onClick={handleDelete}>
                    Confirmer
                </Button>
                <Button variant="outline" onClick={() => navigate("/compagnies")}>
                    Annuler
                </Button>
            </div>
        </div>
    );
}
