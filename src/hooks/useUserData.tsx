import { useQuery } from "@tanstack/react-query";
import useUserStore from "../store/useUserStore";
import axios from "axios";
import { API_ROUTE_PASSWORD } from "../../config";

const fetchUser = async (id) => {
    try {
        const { data } = await axios.get(`${API_ROUTE_PASSWORD}/user/user-connected/${id}`);
        if (!data) {
            throw new Error("Aucune donnée disponible pour cet utilisateur.");
        }
        return data;
    } catch (error) {
        console.error("Erreur lors de la récupération des informations de l'utilisateur:", error);
        throw new Error("Impossible de récupérer les données de l'utilisateur.");
    }
};

export const useUserData = () => {
    const { user } = useUserStore();

    // Si tokenDecode n'est pas disponible, on empêche la requête
    return useQuery({
        queryKey: ["user", user?.tokenDecode],
        queryFn: () => (user?.tokenDecode ? fetchUser(user.tokenDecode) : Promise.resolve(null)),
        enabled: !!user?.tokenDecode,  // Assurez-vous que la requête n'est effectuée que si le token est présent
    });
};
