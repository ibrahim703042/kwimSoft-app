import axios from 'axios';
import { API_ROUTE } from '../config';


// Créer une instance Axios
const axiosInstance = axios.create({
  baseURL: `${API_ROUTE}/`, // URL de base de votre API
});

// Intercepteur pour ajouter le token d'accès à chaque requête
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse pour gérer les tokens expirés
axiosInstance.interceptors.response.use(
  (response) => {
    return response; // Renvoie la réponse si tout se passe bien
  },
  async (error) => {
    const originalRequest = error.config;

    // Vérifier si le token est expiré et que la requête n'a pas encore été réessayée
    if (error.response && error.response.status === 401 && error.response.data.code === 'token_not_valid' && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          // Demande pour rafraîchir le token
          const response = await axios.post(`${API_ROUTE}/api/token/refresh/`, {
            refresh: refreshToken,
          });

          // Stocker le nouveau access_token
          localStorage.setItem('access_token', response.data.access);

          // Mettre à jour l'en-tête Authorization avec le nouveau token
          originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;

          // Réessayer la requête originale avec le nouveau token
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error('Le rafraîchissement du token a échoué :', refreshError);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login'; // Rediriger vers la page de connexion si le token est expiré
        }
      } else {
        // Si le token de rafraîchissement n'existe pas
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error); // Renvoie l'erreur si elle ne concerne pas un token expiré
  }
);

export default axiosInstance;
