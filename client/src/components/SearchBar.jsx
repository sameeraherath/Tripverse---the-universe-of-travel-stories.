import { useState } from "react";
import PropTypes from "prop-types";
import { Search, X, Clock, Heart } from "lucide-react";

const SearchBar = ({ onSearch, onSort }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Debounce search
    setIsSearching(true);
    const timeoutId = setTimeout(() => {
      onSearch(value);
      setIsSearching(false);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    onSearch("");
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    onSort(newSort);
  };

  return (
    <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-200 max-w-2xl mx-auto">
      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search posts by title or content..."
          className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all bg-gray-50 text-gray-900 placeholder-gray-400"
        />
        {searchTerm && (
          <button
            onClick={handleClearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        )}
        {isSearching && (
          <div className="absolute right-14 top-1/2 transform -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Sort Buttons */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-semibold text-gray-700 flex items-center mr-2">
          Sort by:
        </span>

        <button
          onClick={() => handleSortChange("createdAt")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium text-sm ${
            sortBy === "createdAt"
              ? "bg-gradient-primary text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <Clock className="w-4 h-4" />
          Recent
        </button>

        <button
          onClick={() => handleSortChange("likeCount")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium text-sm ${
            sortBy === "likeCount"
              ? "bg-gradient-primary text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <Heart className="w-4 h-4" />
          Popular
        </button>
      </div>

      {/* Search Results Info */}
      {searchTerm && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Searching for:{" "}
            <span className="font-semibold text-gray-900">
              &quot;{searchTerm}&quot;
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onSort: PropTypes.func.isRequired,
};

export default SearchBar;
