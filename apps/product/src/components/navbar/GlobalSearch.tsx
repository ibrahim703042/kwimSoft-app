import { GlobalSearch as SharedGlobalSearch } from "@kwim/shared-ui";

const GlobalSearch = () => {
  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
  };

  return <SharedGlobalSearch onSearch={handleSearch} placeholder="Search..." />;
};

export default GlobalSearch;
