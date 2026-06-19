import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  readonly setSearch: (search: string) => void;
  readonly placeholder?: string;
  readonly debounceMs?: number;
}

export function SearchBar({
  setSearch,
  placeholder = "Recherche",
  debounceMs = 300,
}: Readonly<SearchBarProps>) {
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setSearch(searchInput.toLowerCase().trim());
    }, debounceMs);

    return () => clearTimeout(delayDebounce);
  }, [searchInput, setSearch, debounceMs]);

  return (
    <div className="grid grid-cols-12 items-center">
      <div className="col-span-5">
        <div className="flex items-center gap-2 rounded-md border border-input bg-background pl-3 pr-1 py-1">
          <Input
            type="text"
            placeholder={placeholder}
            value={searchInput}
            className="h-8 border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0"
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <Button className="h-7 px-2" size="sm" type="button" aria-label="Search">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="col-span-7" />
    </div>
  );
}

export default SearchBar;
