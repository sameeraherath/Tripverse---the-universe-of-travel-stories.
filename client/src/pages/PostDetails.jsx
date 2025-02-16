import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState({});

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/posts/${id}`
        );
        setPost(response.data);
      } catch (error) {
        console.error("Error fetching post details:", error);
      }
    };
    fetchPostDetails();
  }, [id]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">{post.title}</h2>
      <p className="mb-4">{post.content}</p>
      <Link to={`/edit/${id}`} className="text-blue-500 hover:underline">
        Edit Post
      </Link>
    </div>
  );
};

export default PostDetails;
