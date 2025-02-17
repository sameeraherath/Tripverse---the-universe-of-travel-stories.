import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const Card = ({ post }) => {
  return (
    <div className="bg-white shadow-md rounded p-4">
      <h3 className="text-xl font-semibold">{post.title}</h3>
      <p className="text-gray-600">{post.content.substring(0, 100)}...</p>
      <Link to={`/post/${post._id}`} className="text-blue-500 hover:underline">
        Read More
      </Link>
    </div>
  );
};

Card.propTypes = {
  post: PropTypes.object.isRequired,
};

export default Card;
