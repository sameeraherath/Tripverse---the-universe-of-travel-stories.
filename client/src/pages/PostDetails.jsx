import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState({});
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/posts/${id}`
        );
        setPost(response.data);

        const token = localStorage.getItem("authToken");
        if (token) {
          const decodedToken = JSON.parse(atob(token.split(".")[1]));
          setUserId(decodedToken.userId);
        }
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
      const token = localStorage.getItem("authToken");

      if (!token) {
        alert("You are not authenticated. Please log in.");
        navigate("/login");
        return;
      }

      await axios.delete(`${import.meta.env.VITE_API_URL}/api/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Post deleted successfully.");
      navigate("/home");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again.");
    }
  };

  if (!post.title) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container lg:w-1/2 lg:mx-auto px-4 py-24">
      {post.image && (
        <img
          src={`${post.image}`}
          alt={post.title}
          className="w-full h-64 object-cover mb-4 rounded-lg"
        />
      )}
      <div className="pt-4 pb-4">
        <p className="text-gray-300 ">
          By{" "}
          <span className="text-gray-300">
            {post.author.profile?.name || "Unknown User"}
          </span>
        </p>
      </div>
      <h2 className="text-3xl font-bold mb-4">{post.title}</h2>
      <p className="mb-4">{post.content}</p>
      {userId && post.author && userId === post.author && (
        <>
          <Link to={`/edit/${id}`} className="text-blue-500 ">
            Edit Post
          </Link>
          <button onClick={handleDelete} className="text-red-500  ml-4">
            Delete
          </button>
        </>
      )}
    </div>
  );
};

export default PostDetails;
