import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { likePost } from "../features/posts/postsSlice";

const Card = ({ post }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const handleLike = () => {
    console.log("Like button clicked");
    console.log("Auth token:", token);
    console.log("Post data:", post);

    if (!token) {
      console.log("User not logged in, returning early");
      return; // Only allow logged in users to like
    }
    console.log("Dispatching likePost action with post ID:", post._id);
    dispatch(likePost(post._id));
  };

  if (!post) {
    return (
      <div className="bg-white shadow-lg p-5 rounded-3xl flex flex-col gap-4 hover:shadow-xl transition-shadow">
        <Skeleton
          height={192}
          className="rounded-3xl"
          baseColor="#F3F4F6"
          highlightColor="#e5e7eb"
        />
        <h3 className="text-2xl font-semibold text-gray-dark">
          <Skeleton width="60%" baseColor="#F3F4F6" highlightColor="#e5e7eb" />
        </h3>
        <p className="text-gray-medium">
          <Skeleton count={3} baseColor="#F3F4F6" highlightColor="#e5e7eb" />
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg p-5 rounded-3xl flex flex-col gap-4 hover:shadow-xl transition-shadow">
      {post.image ? (
        <img
          src={post.image}
          alt={post.title}
          className="rounded-3xl w-full h-48 object-cover"
        />
      ) : (
        <Skeleton
          height={192}
          className="rounded-3xl"
          baseColor="#F3F4F6"
          highlightColor="#e5e7eb"
        />
      )}
      <h3 className="text-2xl font-semibold text-gray-dark">{post.title}</h3>
      <p className="text-gray-medium line-clamp-3">
        {post.content.substring(0, 100)}
      </p>
      <div className="flex justify-between items-center">
        <Link
          to={`/post/${post._id}`}
          className="text-primary hover:text-primary-light transition-colors font-medium"
        >
          Read More →
        </Link>
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-3 py-1 rounded-full transition-colors ${
            post.liked ? "text-red-500" : "text-gray-500"
          } ${token ? "hover:text-red-500" : "cursor-not-allowed"}`}
          disabled={!token}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill={post.liked ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span>{post.likeCount || 0}</span>
        </button>
      </div>
    </div>
  );
};

Card.propTypes = {
  post: PropTypes.object,
};

export default Card;
