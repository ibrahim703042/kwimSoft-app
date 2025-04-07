import axios from 'axios';

const fetchData = async (url, params = {}) => {
    try {
        // Effectuer la requête GET
        const response = await axios.get(url, { params });
        return response.data;  // Retourner les données reçues
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        throw error;  // Relancer l'erreur pour la gestion dans le composant
    }
};

export default fetchData;
