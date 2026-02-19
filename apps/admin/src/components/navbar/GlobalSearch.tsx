import React, { useState } from "react";
import { Search } from "lucide-react";

const GlobalSearch: React.FC = () => {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", query);
    // TODO: hook to actual global search logic
  };

  return (
    <form onSubmit={handleSearch} className="relative w-64 max-w-xs">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
      />
      <button type="submit" className="absolute right-2 top-2 text-gray-500">
        <Search size={16} />
      </button>
    </form>
  );
};

export default GlobalSearch;
