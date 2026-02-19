import { useSearchParams } from "react-router-dom";
import { useCallback } from "react";

/**
 * Hook to sync state with URL query parameters
 * 
 * @param key - Query parameter key
 * @param defaultValue - Default value if parameter is not present
 * @returns [value, setValue] tuple
 */
export function useQueryState(
  key: string,
  defaultValue: string = ""
): [string, (value: string) => void] {
  const [searchParams, setSearchParams] = useSearchParams();

  const value = searchParams.get(key) || defaultValue;

  const setValue = useCallback(
    (newValue: string) => {
      const newSearchParams = new URLSearchParams(searchParams);
      
      if (newValue) {
        newSearchParams.set(key, newValue);
      } else {
        newSearchParams.delete(key);
      }
      
      setSearchParams(newSearchParams);
    },
    [key, searchParams, setSearchParams]
  );

  return [value, setValue];
}

/**
 * Hook to manage multiple query parameters
 * 
 * @returns Object with query params and update function
 */
export function useQueryParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const getParam = useCallback(
    (key: string, defaultValue: string = ""): string => {
      return searchParams.get(key) || defaultValue;
    },
    [searchParams]
  );

  const setParam = useCallback(
    (key: string, value: string) => {
      const newSearchParams = new URLSearchParams(searchParams);
      
      if (value) {
        newSearchParams.set(key, value);
      } else {
        newSearchParams.delete(key);
      }
      
      setSearchParams(newSearchParams);
    },
    [searchParams, setSearchParams]
  );

  const setParams = useCallback(
    (params: Record<string, string>) => {
      const newSearchParams = new URLSearchParams(searchParams);
      
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          newSearchParams.set(key, value);
        } else {
          newSearchParams.delete(key);
        }
      });
      
      setSearchParams(newSearchParams);
    },
    [searchParams, setSearchParams]
  );

  const clearParams = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  return {
    params: Object.fromEntries(searchParams.entries()),
    getParam,
    setParam,
    setParams,
    clearParams,
  };
}
