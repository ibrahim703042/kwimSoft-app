import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SearchBar } from "@kwim/shared-ui";

interface PageToolbarProps {
  search?: string;
  onSearchChange?: (value: string) => void;
  filters?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

/**
 * Toolbar for search, filters, and additional actions
 */
export function PageToolbar({ 
  search, 
  onSearchChange, 
  filters, 
  actions,
  className 
}: PageToolbarProps) {
  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <div className="flex items-center gap-2 flex-1">
        {onSearchChange && (
          <div className="flex-1 max-w-sm">
            <SearchBar setSearch={onSearchChange} placeholder="Recherche" />
          </div>
        )}
        {filters}
      </div>
      
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}
