import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const Card = ({ post }) => {
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
      <Link
        to={`/post/${post._id}`}
        className="text-primary hover:text-primary-light transition-colors font-medium"
      >
        Read More →
      </Link>
    </div>
  );
};

Card.propTypes = {
  post: PropTypes.object,
};

export default Card;
