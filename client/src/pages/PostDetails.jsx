import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/posts/${id}`
        );
        setPost(response.data);
      } catch (error) {
        console.error("Error fetching post details:", error);
      }
    };
    fetchPostDetails();
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/posts/${id}`);
      alert("Post deleted successfully");
      navigate("/");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Error deleting post");
    }
  };

  if (!post.title) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-20">
      {post.image && (
        <img
          src={`${import.meta.env.VITE_API_URL}${post.image}`}
          alt={post.title}
          className="w-full h-64 object-cover mb-4 rounded-lg"
        />
      )}
      <h2 className="text-3xl font-bold mb-4">{post.title}</h2>
      <p className="mb-4">{post.content}</p>
      <Link to={`/edit/${id}`} className="text-blue-500 hover:underline">
        Edit Post
      </Link>
      <button
        onClick={handleDelete}
        className="text-red-500 hover:underline ml-4"
      >
        Delete
      </button>
    </div>
  );
};

export default PostDetails;
