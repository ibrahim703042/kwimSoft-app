import axios, { AxiosRequestConfig } from 'axios';

const fetchData = async <T = unknown>(url: string, params: Record<string, unknown> = {}): Promise<T> => {
    try {
        // Effectuer la requête GET
        const response = await axios.get<T>(url, { params } as AxiosRequestConfig);
        return response.data;  // Retourner les données reçues
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        throw error;  // Relancer l'erreur pour la gestion dans le composant
    }
};

export default fetchData;
