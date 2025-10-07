import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Layers, ChevronDown } from "lucide-react";
import api from "../utils/api";

const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/api/posts/categories/all");
        setCategories(["All", ...response.data.categories]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategorySelect = (category) => {
    onCategoryChange(category);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-orange-300 transition-all duration-300 shadow-sm hover:shadow-md"
      >
        <Layers className="w-4 h-4 text-orange-500" />
        <span className="font-medium text-gray-700">
          {selectedCategory || "All Categories"}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Menu */}
          <div className="absolute top-full left-0 mt-2 w-56 bg-white border-2 border-gray-100 rounded-lg shadow-xl z-20 overflow-hidden animate-scale-in">
            <div className="max-h-80 overflow-y-auto">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={`w-full text-left px-4 py-3 hover:bg-orange-50 transition-colors duration-200 ${
                    selectedCategory === category
                      ? "bg-orange-100 text-orange-600 font-semibold"
                      : "text-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{category}</span>
                    {selectedCategory === category && (
                      <span className="text-orange-500">✓</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

CategoryFilter.propTypes = {
  selectedCategory: PropTypes.string,
  onCategoryChange: PropTypes.func.isRequired,
};

export default CategoryFilter;
