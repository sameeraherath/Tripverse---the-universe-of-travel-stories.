import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const Card = ({ post }) => {
  return (
    <div className="bg-neutral-900 shadow-md  p-4 rounded-3xl">
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-48 object-cover mb-4 rounded-3xl pt-2"
        />
      )}
      <h3 className="text-2xl font-semibold">{post.title}</h3>
      <p className="text-gray-100 pt-4 ">{post.content.substring(0, 100)}...</p>
      <Link
        to={`/post/${post._id}`}
        className="text-blue-500  block mt-4 opacity-80"
      >
        Read More
      </Link>
    </div>
  );
};

Card.propTypes = {
  post: PropTypes.object.isRequired,
};

export default Card;
