import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { bookmarkPost, removeBookmark } from "../features/posts/postsSlice";
import { Bookmark, Loader2 } from "lucide-react";
import api from "../utils/api";

const BookmarkButton = ({ postId, variant = "default" }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);

  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (!token || !postId) return;

      try {
        const response = await api.get(`/api/profile/bookmark/status/${postId}`);
        setIsBookmarked(response.data.isBookmarked);
      } catch (error) {
        console.error("Error checking bookmark status:", error);
      }
    };

    checkBookmarkStatus();
  }, [postId, token]);

  const handleBookmarkToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token || isProcessing) return;

    setIsProcessing(true);
    try {
      if (isBookmarked) {
        const result = await dispatch(removeBookmark(postId)).unwrap();
        setIsBookmarked(false);
        setBookmarkCount(result.bookmarkCount);
      } else {
        const result = await dispatch(bookmarkPost(postId)).unwrap();
        setIsBookmarked(true);
        setBookmarkCount(result.bookmarkCount);
      }
    } catch (error) {
      console.error("Bookmark action failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!token) {
    return null;
  }

  if (variant === "icon-only") {
    return (
      <button
        onClick={handleBookmarkToggle}
        disabled={isProcessing}
        className={`p-2 rounded-lg transition-all duration-300 ${
          isBookmarked
            ? "text-orange-500 bg-orange-50"
            : "text-gray-500 hover:text-orange-500 hover:bg-orange-50"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        title={isBookmarked ? "Remove bookmark" : "Bookmark post"}
      >
        {isProcessing ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Bookmark
            className="w-5 h-5"
            fill={isBookmarked ? "currentColor" : "none"}
          />
        )}
      </button>
    );
  }

  if (variant === "compact") {
    return (
      <button
        onClick={handleBookmarkToggle}
        disabled={isProcessing}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 ${
          isBookmarked
            ? "text-orange-500 bg-orange-50"
            : "text-gray-500 hover:text-orange-500 hover:bg-orange-50"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isProcessing ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Bookmark
            className="w-4 h-4"
            fill={isBookmarked ? "currentColor" : "none"}
          />
        )}
        {bookmarkCount > 0 && (
          <span className="text-sm font-medium">{bookmarkCount}</span>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleBookmarkToggle}
      disabled={isProcessing}
      className={`group relative inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 ${
        isBookmarked
          ? "bg-orange-500 text-white"
          : "bg-white border-2 border-orange-500 text-orange-500 hover:bg-orange-50"
      }`}
    >
      {isProcessing ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>{isBookmarked ? "Removing..." : "Saving..."}</span>
        </>
      ) : (
        <>
          <Bookmark
            className="w-5 h-5"
            fill={isBookmarked ? "currentColor" : "none"}
          />
          <span>{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
        </>
      )}
    </button>
  );
};

BookmarkButton.propTypes = {
  postId: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(["default", "compact", "icon-only"]),
};

export default BookmarkButton;
