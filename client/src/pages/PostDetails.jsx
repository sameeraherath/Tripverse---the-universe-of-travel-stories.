import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [authorProfile, setAuthorProfile] = useState(null);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/posts/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        setPost(response.data);
        console.log("Post Data:", response.data);

        if (response.data.author) {
          const profileResponse = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/profile/user/${
              response.data.author._id
            }`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }
          );

          setAuthorProfile(profileResponse.data);
          console.log("Author Profile Data:", profileResponse.data); // Debug
        }

        const token = localStorage.getItem("authToken");
        if (token) {
          const decodedToken = JSON.parse(atob(token.split(".")[1]));

          setUserId(decodedToken.userId);
        }
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load post");
      } finally {
        setLoading(false);
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!post) return <div>No post found</div>;

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
        <p className="text-gray-400 ">
          By{" "}
          <span className="text-gray-400">
            {authorProfile ? authorProfile.name : "Unknown User"}
          </span>
        </p>
      </div>
      <h2 className="text-3xl font-bold mb-4">{post.title}</h2>
      <p className="mb-4">{post.content}</p>
      {userId && post.author && userId === post.author._id && (
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
