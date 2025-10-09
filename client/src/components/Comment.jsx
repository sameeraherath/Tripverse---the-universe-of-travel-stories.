import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteComment } from "../features/comments/commentsSlice";
import PropTypes from "prop-types";
import { Trash2, Clock } from "lucide-react";
import ConfirmDialog from "./ConfirmDialog";

const Comment = ({ comment }) => {
  const dispatch = useDispatch();
  const { userId } = useSelector((state) => state.auth);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteClick = () => {
    console.log("Delete button clicked - opening dialog");
    setShowDeleteDialog(true);
  };

  const handleDelete = async () => {
    console.log("Confirming delete");
    setIsDeleting(true);
    await dispatch(deleteComment(comment._id));
    setIsDeleting(false);
    setShowDeleteDialog(false);
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffMs = now - commentDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return commentDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Get author name from profile
  const authorName = comment.author?.profile?.name?.trim() || "Anonymous User";
  const authorAvatar = comment.author?.profile?.avatar;

  return (
    <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-300">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          {authorAvatar ? (
            <img
              src={authorAvatar}
              alt={authorName}
              className="w-10 h-10 rounded-full object-cover border-2 border-orange-200"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
              {authorName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-bold text-gray-900">{authorName}</h4>
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <Clock className="w-3.5 h-3.5" />
                <span>{getTimeAgo(comment.createdAt)}</span>
              </div>
            </div>
            {userId && userId === comment.author._id && (
              <button
                onClick={handleDeleteClick}
                disabled={isDeleting}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            )}
          </div>

          <p className="text-gray-700 leading-relaxed">{comment.content}</p>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Comment"
        message="Are you sure you want to delete this comment? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </div>
  );
};
Comment.propTypes = {
  comment: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    author: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      email: PropTypes.string,
      profile: PropTypes.shape({
        name: PropTypes.string,
        avatar: PropTypes.string,
      }),
    }).isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
};

export default Comment;
