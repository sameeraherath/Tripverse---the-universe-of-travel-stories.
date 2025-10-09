import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Tag } from "lucide-react";
import api from "../utils/api";

const TagCloud = ({ onTagClick, selectedTags = [] }) => {
  const [popularTags, setPopularTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularTags = async () => {
      try {
        const response = await api.get("/api/posts/tags/popular");
        setPopularTags(response.data.tags);
      } catch (error) {
        console.error("Error fetching popular tags:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularTags();
  }, []);

  const getFontSize = (count) => {
    const maxCount = Math.max(...popularTags.map((t) => t.count));
    const minCount = Math.min(...popularTags.map((t) => t.count));
    const ratio = (count - minCount) / (maxCount - minCount || 1);
    return 0.75 + ratio * 0.75; // Range from 0.75rem to 1.5rem
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-bold text-gray-dark">Popular Tags</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-8 w-20 bg-gray-200 rounded-full animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (popularTags.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Tag className="w-5 h-5 text-orange-500" />
        <h3 className="text-lg font-bold text-gray-dark">Popular Tags</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {popularTags.map(({ tag, count }) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => onTagClick(tag)}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full font-medium transition-all duration-300 transform hover:-translate-y-0.5 border ${
                isSelected
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-orange-50 text-orange-700 hover:bg-orange-100 border-orange-200"
              }`}
              style={{ fontSize: `${getFontSize(count)}rem` }}
              title={`${count} posts`}
            >
              {tag}
              <span
                className={`text-xs ${
                  isSelected ? "text-orange-100" : "text-orange-400"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

TagCloud.propTypes = {
  onTagClick: PropTypes.func.isRequired,
  selectedTags: PropTypes.arrayOf(PropTypes.string),
};

export default TagCloud;
