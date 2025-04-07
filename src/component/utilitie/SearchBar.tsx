import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function SearchBar({ setSearch }) {
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setSearch(searchInput.toLowerCase().trim()); // Normalisation
    }, 300); // Délai de 300ms pour éviter les requêtes instantanées

    return () => clearTimeout(delayDebounce);
  }, [searchInput, setSearch]);

  return (
    <div className="grid grid-cols-12 items-center">
      <div className="col-span-5">
        <div className="bg-white pl-3 pr-1 flex justify-between py-[4px] rounded-md">
          <input
            type="text"
            placeholder="Recherche"
            value={searchInput}
            className="text-[0.8rem] bg-transparent outline-none w-full mx-2"
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <Button className="h-[1.7rem] text-[0.6rem] px-3 py-4" size="50">
            <Search />
          </Button>
        </div>
      </div>
      <div className="col-span-7"></div>
    </div>
  );
}
