import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { likePost } from "../features/posts/postsSlice";
import BookmarkButton from "./BookmarkButton";
import { MessageCircle } from "lucide-react";

const Card = ({ post }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const handleLike = (e) => {
    e.preventDefault();
    if (!token) {
      return;
    }
    dispatch(likePost(post._id));
  };

  if (!post) {
    return (
      <div className="bg-white p-5 rounded-2xl flex flex-col gap-4 transition-all duration-300 border border-gray-200">
        <Skeleton
          height={192}
          className="rounded-xl"
          baseColor="#F3F4F6"
          highlightColor="#e5e7eb"
        />
        <div className="space-y-3">
          <Skeleton
            width="80%"
            height={24}
            baseColor="#F3F4F6"
            highlightColor="#e5e7eb"
          />
          <Skeleton count={3} baseColor="#F3F4F6" highlightColor="#e5e7eb" />
          <div className="flex justify-between pt-2">
            <Skeleton
              width={100}
              baseColor="#F3F4F6"
              highlightColor="#e5e7eb"
            />
            <Skeleton width={60} baseColor="#F3F4F6" highlightColor="#e5e7eb" />
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffTime = Math.abs(now - postDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return postDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Link to={`/post/${post._id}`} className="block group">
      <div className="bg-white p-5 rounded-2xl flex flex-col gap-4 transition-all duration-300 border border-gray-200 hover:border-primary/50 hover:-translate-y-1 h-full">
        <div className="relative overflow-hidden rounded-xl">
          {post.image ? (
            <img
              src={post.image}
              alt={post.title}
              className="rounded-xl w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="rounded-xl w-full h-48 bg-gradient-to-br from-primary/10 to-primary-light/20 flex items-center justify-center">
              <span className="text-6xl">📝</span>
            </div>
          )}
          {post.createdAt && (
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700">
              {formatDate(post.createdAt)}
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col gap-3">
          {/* Author Info */}
          {post.author && (
            <Link
              to={`/profile/${post.author._id}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              {post.author.profile?.avatar ? (
                <img
                  src={post.author.profile.avatar}
                  alt={post.author.profile.name || "Author"}
                  className="w-8 h-8 rounded-full object-cover border-2 border-orange-200"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xs font-bold">
                  {(post.author.profile?.name?.trim() ||
                    "Anonymous")[0].toUpperCase()}
                </div>
              )}
              <span className="text-sm font-medium text-gray-700">
                {post.author.profile?.name?.trim() || "Anonymous User"}
              </span>
            </Link>
          )}

          <h3 className="text-xl font-bold text-gray-dark line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>

          <p className="text-gray-medium line-clamp-3 text-sm leading-relaxed">
            {post.content.substring(0, 150)}
            {post.content.length > 150 ? "..." : ""}
          </p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-block px-2 py-0.5 bg-orange-50 text-orange-600 text-xs rounded-full"
                >
                  #{tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="text-xs text-gray-400">
                  +{post.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div className="flex items-center gap-4 text-sm">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 ${
                post.liked
                  ? "text-red-500 bg-red-50"
                  : "text-gray-500 hover:text-red-500 hover:bg-red-50"
              } ${!token ? "cursor-not-allowed opacity-50" : ""}`}
              disabled={!token}
              title={!token ? "Login to like" : ""}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill={post.liked ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span className="font-medium">{post.likeCount || 0}</span>
            </button>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-gray-500">
              <MessageCircle className="h-4 w-4" />
              <span className="font-medium">{post.commentCount || 0}</span>
            </div>

            <BookmarkButton postId={post._id} variant="compact" />
          </div>

          <div className="text-primary font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
            Read More
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};

Card.propTypes = {
  post: PropTypes.object,
};

export default Card;
