/**
 * PageFilters — Reusable filter bar in a CardDataTable-style card.
 * Filter inputs (search + selects) are hidden by default; click the filter icon to show them.
 */
import { useState } from "react";
import { Search, Filter } from "lucide-react";
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@kwim/shared-ui";

export interface PageFilterSelectOption {
  value: string;
  label: string;
}

export interface PageFilterSelect {
  placeholder: string;
  value: string;
  onValueChange: (value: string) => void;
  options: PageFilterSelectOption[];
  className?: string;
}

export interface PageFiltersProps {
  /** Placeholder for search input */
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  selects?: PageFilterSelect[];
  /** Optional callback when filter icon is clicked (in addition to toggling visibility) */
  onFilterClick?: () => void;
  /** Card-style header: title (e.g. "Data") shown when filters are collapsed */
  cardTitle?: string;
  /** Card-style header: count shown next to title, e.g. (6) */
  cardCount?: number;
  /** If true, filter inputs are visible by default; default false (hidden by default) */
  filtersExpandedDefault?: boolean;
}

export function PageFilters({
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  selects = [],
  onFilterClick,
  cardTitle,
  cardCount,
  filtersExpandedDefault = false,
}: PageFiltersProps) {
  const [filtersVisible, setFiltersVisible] = useState(filtersExpandedDefault);

  const toggleFilters = () => {
    setFiltersVisible((prev) => !prev);
    onFilterClick?.();
  };

  return (
    <div className="mb-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 bg-white dark:bg-gray-800 p-4 rounded-xl py-5 gap-y-2 border">
        {/* Left: optional card title + count (CardDataTable-style) */}
        <div className="lg:col-span-6 sm:col-span-2 flex flex-col justify-center">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-8 space-y-1 sm:space-y-0">
            {cardTitle != null && (
              <p className="font-medium text-muted-foreground dark:text-[#191c21c8] text-[0.95rem]">
                {cardTitle}
                {cardCount != null && (
                  <span className="text-[0.7rem] font-normal ml-1">({cardCount})</span>
                )}
              </p>
            )}
          </div>
        </div>

        {/* Right: filter icon button — always visible */}
        <div className="lg:col-span-6 flex items-center justify-end sm:justify-start lg:justify-end">
          <button
            type="button"
            onClick={toggleFilters}
            className="bg-primary/20 dark:bg-[#707eae3a] rounded-full h-9 w-9 flex justify-center items-center hover:bg-primary/30 dark:hover:bg-[#707eae50] transition-colors"
            aria-label={filtersVisible ? "Hide filters" : "Show filters"}
          >
            <Filter className="h-4 w-4 text-primary dark:text-[#707eae]" />
          </button>
        </div>

        {/* Filter inputs row — visible only when toggled */}
        {filtersVisible && (
          <div className="lg:col-span-12 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-border/50 mt-2">
            <div className="relative flex-1 min-w-0 max-w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>
            {selects.map((sel, index) => (
              <Select
                key={index}
                value={sel.value}
                onValueChange={sel.onValueChange}
              >
                <SelectTrigger className={`w-full sm:w-auto sm:min-w-[140px] ${sel.className ?? ""}`}>
                  <SelectValue placeholder={sel.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {sel.options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
