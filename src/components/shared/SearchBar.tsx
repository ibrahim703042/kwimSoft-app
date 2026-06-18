import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  setSearch: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  setSearch,
  placeholder = "Rechercher...",
}: Readonly<SearchBarProps>) {
  return (
    <div className="relative">
      <Search
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        type="search"
        placeholder={placeholder}
        className="pl-9"
        onChange={(e) => setSearch(e.target.value)}
        aria-label={placeholder}
      />
    </div>
  );
}
