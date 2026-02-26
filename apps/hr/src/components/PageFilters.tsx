/**
 * PageFilters — Reusable search + filter bar (search input, optional selects, filter button).
 */
import { Search, Filter } from "lucide-react";
import {
  Input,
  Button,
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
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  selects?: PageFilterSelect[];
  showFilterButton?: boolean;
  onFilterClick?: () => void;
}

export function PageFilters({
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  selects = [],
  showFilterButton = false,
  onFilterClick,
}: PageFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white dark:bg-gray-800 p-4 rounded-lg border">
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
      {showFilterButton && (
        <Button variant="outline" size="icon" onClick={onFilterClick} className="shrink-0">
          <Filter className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
