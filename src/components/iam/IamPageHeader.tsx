import { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface IamPageHeaderProps {
  title: string;
  description?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  actions?: ReactNode;
}

export default function IamPageHeader({
  title,
  description,
  searchPlaceholder = "Search...",
  onSearchChange,
  actions,
}: Readonly<IamPageHeaderProps>) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        {onSearchChange && (
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder={searchPlaceholder}
              onChange={(e) => onSearchChange(e.target.value)}
              aria-label={searchPlaceholder}
            />
          </div>
        )}
        {actions}
      </div>
    </div>
  );
}
