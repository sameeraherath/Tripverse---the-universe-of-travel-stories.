import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createComment } from "../features/comments/commentsSlice";
import PropTypes from "prop-types";
import { Send } from "lucide-react";

const CommentForm = ({ postId }) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    await dispatch(createComment({ content, postId }));
    setContent("");
    setIsSubmitting(false);
  };

  if (!token) {
    return (
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-primary/20 rounded-xl p-6 text-center">
        <p className="text-gray-700 font-medium mb-3">
          💬 Want to join the conversation?
        </p>
        <a
          href="/LoginPage"
          className="inline-block px-6 py-2 bg-gradient-primary text-white font-semibold rounded-full border border-gray-200 transition-all"
        >
          Login to Comment
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts..."
          className="w-full px-5 py-4 pr-24 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent resize-none transition-all bg-white text-gray-900 placeholder-gray-400"
          rows="3"
          maxLength={1000}
        />
        <div className="absolute bottom-4 right-4 text-sm text-gray-400">
          {content.length}/1000
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="flex items-center gap-2 bg-gradient-primary text-white px-6 py-3 rounded-xl font-semibold border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Posting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Post Comment
            </>
          )}
        </button>
      </div>
    </form>
  );
};
CommentForm.propTypes = {
  postId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default CommentForm;
