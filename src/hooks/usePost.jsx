import axios from "axios";
import { useState } from "react";

const usePost = (initialUrl, initialData = {}, options = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fonction pour envoyer une requête POST
  const postData = async (url = initialUrl, data = initialData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post(url, data, options);
      setSuccess(true);
      return response.data; // Renvoie les données pour une utilisation ultérieure
    } catch (err) {
      setError(err);
      console.error("Erreur lors de la requête POST :", err);
      throw err; // Rejette l'erreur pour la gestion dans le composant
    } finally {
      setLoading(false);
    }
  };

  return { postData, loading, error, success };
};

export default usePost;
