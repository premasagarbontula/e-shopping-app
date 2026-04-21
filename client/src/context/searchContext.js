import { useState, useContext, createContext, useMemo } from "react";

const SearchContext = createContext();

const SearchProvider = ({ children }) => {
  const [search, setSearch] = useState({
    keyword: "",
    results: [],
    fromSubmit: false,
  });

  const value = useMemo(() => ({ search, setSearch }), [search]);

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};

const useSearch = () => useContext(SearchContext);

export { useSearch, SearchProvider };
