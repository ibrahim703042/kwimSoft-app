import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Search } from "lucide-react";

interface SearchBarProps {
  setSearch: (search: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export function SearchBar({ setSearch, placeholder = "Recherche", debounceMs = 300 }: SearchBarProps) {
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
        <div className="bg-white pl-3 pr-1 flex justify-between py-[4px] rounded-md">
          <input
            type="text"
            placeholder={placeholder}
            value={searchInput}
            className="text-[0.8rem] bg-transparent outline-none w-full mx-2"
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <Button className="h-[1.7rem] text-[0.6rem] px-3 py-4" size="sm">
            <Search />
          </Button>
        </div>
      </div>
      <div className="col-span-7"></div>
    </div>
  );
}

export default SearchBar;
