import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { useState } from "react";

const usePost = <T = unknown, D = unknown>(
  initialUrl?: string,
  initialData: D = {} as D,
  options: AxiosRequestConfig = {}
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError | null>(null);
  const [success, setSuccess] = useState(false);

  // Fonction pour envoyer une requête POST
  const postData = async (url: string = initialUrl || "", data: D = initialData): Promise<T> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post<T>(url, data, options);
      setSuccess(true);
      return response.data; // Renvoie les données pour une utilisation ultérieure
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError);
      console.error("Erreur lors de la requête POST :", axiosError);
      throw axiosError; // Rejette l'erreur pour la gestion dans le composant
    } finally {
      setLoading(false);
    }
  };

  return { postData, loading, error, success };
};

export default usePost;
