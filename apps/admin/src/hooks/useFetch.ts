import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { useEffect, useState } from "react";

const useFetch = <T = unknown>(url: string | null, options: AxiosRequestConfig = {}) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<AxiosError | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const response = await axios.get<T>(url as string, options);
        setData(response.data);
      } catch (err) {
        setError(err as AxiosError);
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetch();
    }
  }, [url, options]);

  return { data, error, loading };
};

export default useFetch;
