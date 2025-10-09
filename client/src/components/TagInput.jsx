import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { X, Tag } from "lucide-react";

const TagInput = ({ tags, onChange, maxTags = 10 }) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (inputValue.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch("/api/posts/tags/all");
        const data = await response.json();
        const filtered = data.tags.filter(
          (tag) =>
            tag.toLowerCase().includes(inputValue.toLowerCase()) &&
            !tags.includes(tag)
        );
        setSuggestions(filtered.slice(0, 5));
      } catch (error) {
        console.error("Error fetching tag suggestions:", error);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [inputValue, tags]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setShowSuggestions(true);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue.trim());
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const addTag = (tag) => {
    if (tags.length >= maxTags) {
      return;
    }

    const formattedTag = tag.trim().toLowerCase();
    if (formattedTag && !tags.includes(formattedTag)) {
      onChange([...tags, formattedTag]);
    }
    setInputValue("");
    setShowSuggestions(false);
  };

  const removeTag = (tagToRemove) => {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        Tags (Press Enter to add)
      </label>

      <div className="relative">
        {/* Tags Display & Input */}
        <div className="flex flex-wrap items-center gap-2 p-3 border-2 border-gray-200 bg-gray-50 rounded-xl focus-within:ring-2 focus-within:ring-orange-500/50 focus-within:border-orange-500 transition-all">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
            >
              <Tag className="w-3 h-3" />
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:bg-orange-200 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            onFocus={() => setShowSuggestions(true)}
            placeholder={
              tags.length >= maxTags
                ? `Maximum ${maxTags} tags`
                : "Add a tag..."
            }
            disabled={tags.length >= maxTags}
            className="flex-1 min-w-[120px] bg-transparent border-none focus:outline-none text-gray-900 placeholder-gray-400 disabled:cursor-not-allowed"
          />
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowSuggestions(false)}
            ></div>
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-lg z-20 overflow-hidden animate-scale-in">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => addTag(suggestion)}
                  className="w-full text-left px-4 py-2 hover:bg-orange-50 transition-colors flex items-center gap-2"
                >
                  <Tag className="w-4 h-4 text-orange-500" />
                  <span className="text-gray-700">{suggestion}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <p className="text-xs text-gray-500">
        {tags.length}/{maxTags} tags added
      </p>
    </div>
  );
};

TagInput.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  maxTags: PropTypes.number,
};

export default TagInput;
