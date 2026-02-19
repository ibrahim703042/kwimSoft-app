import { useState, useCallback } from "react";

export type FilterValue = string | number | boolean | Date | null | undefined;
export type Filters = Record<string, FilterValue>;

export interface UseFiltersReturn {
  filters: Filters;
  setFilter: (key: string, value: FilterValue) => void;
  removeFilter: (key: string) => void;
  clearFilters: () => void;
  hasFilters: boolean;
  activeFilterCount: number;
}

/**
 * Hook for managing filter state
 * 
 * @param initialFilters - Initial filter values
 * @returns Filter state and actions
 */
export function useFilters(initialFilters: Filters = {}): UseFiltersReturn {
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const setFilter = useCallback((key: string, value: FilterValue) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const removeFilter = useCallback((key: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const activeFilterCount = Object.keys(filters).filter(
    (key) => filters[key] !== null && filters[key] !== undefined && filters[key] !== ""
  ).length;

  const hasFilters = activeFilterCount > 0;

  return {
    filters,
    setFilter,
    removeFilter,
    clearFilters,
    hasFilters,
    activeFilterCount,
  };
}
