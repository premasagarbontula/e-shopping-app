import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { useSearch } from "../../context/searchContext";
import API from "../../api/axios";

const SearchInput = () => {
  const { search, setSearch } = useSearch();
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const navigate = useNavigate();

  // debounce search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!search.keyword.trim() || !showSuggestions || search.fromSubmit) {
        setSuggestions([]);
        return;
      }

      try {
        const { data } = await API.get(`/product/search/${search.keyword}`);
        setSuggestions(data?.results || []);
      } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [search.keyword, showSuggestions, search.fromSubmit]);

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.get(`/product/search/${search.keyword}`);

      setSearch((prev) => ({
        ...prev,
        results: data?.results || [],
        fromSubmit: true, // mark as search mode
      }));

      setShowSuggestions(false);
      setSuggestions([]);

      navigate("/search");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  // handle suggestion click
  const handleSelect = (item) => {
    setSearch((prev) => ({
      ...prev,
      keyword: item.name,
    }));

    setShowSuggestions(false); // stop suggestions
    setSuggestions([]);

    navigate(`/product/${item.slug}`);
  };

  return (
    <div className="relative w-full max-w-sm">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="search"
          placeholder="Search Products"
          value={search.keyword}
          onChange={(e) => {
            setSearch((prev) => ({
              ...prev,
              keyword: e.target.value,
              fromSubmit: false,
            }));

            setShowSuggestions(true);
          }}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-indigo-900 focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 rounded-lg hover:bg-indigo-700"
        >
          Search
        </button>
      </form>

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && showSuggestions && (
        <div className="absolute w-full mt-1 bg-indigo-900 border rounded-lg shadow z-50 max-h-60 overflow-y-auto">
          {suggestions.map((item) => (
            <button
              key={item._id}
              onClick={() => handleSelect(item)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-violet-900"
            >
              {item.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
