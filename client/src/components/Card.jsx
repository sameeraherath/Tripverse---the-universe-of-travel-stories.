import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const Card = ({ post }) => {
  if (!post) {
    return (
      <div className="bg-neutral-900 shadow-lg p-5 rounded-3xl flex flex-col gap-4">
        <Skeleton
          height={192}
          className="rounded-3xl"
          baseColor="#2d2d2d"
          highlightColor="#3d3d3d"
        />
        <h3 className="text-2xl font-semibold text-neutral-700">
          <Skeleton width="60%" baseColor="#3d3d3d" highlightColor="#4d4d4d" />
        </h3>
        <p className="text-gray-300">
          <Skeleton count={3} baseColor="#3d3d3d" highlightColor="#4d4d4d" />
        </p>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 shadow-lg p-5 rounded-3xl flex flex-col gap-4">
      {post.image ? (
        <img src={post.image} alt={post.title} className="rounded-3xl" />
      ) : (
        <Skeleton
          height={192}
          className="rounded-3xl"
          baseColor="#2d2d2d"
          highlightColor="#3d3d3d"
        />
      )}
      <h3 className="text-2xl font-semibold text-gray-50">{post.title}</h3>
      <p className="text-gray-300">{post.content.substring(0, 100)}</p>
      <Link to={`/post/${post._id}`} className="text-blue-400">
        Read More →
      </Link>
    </div>
  );
};

Card.propTypes = {
  post: PropTypes.object,
};

export default Card;
