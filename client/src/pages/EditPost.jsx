import { useState, useEffect } from "react";
import PostForm from "../components/PostForm";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({ title: "", content: "" });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/posts/${id}`
        );
        setPost(response.data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [id]);

  const handleSubmit = async (updatedData) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("You are not authenticated. Please log in.");
        navigate("/");
        return;
      }
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/posts/${id}`,
        updatedData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Post updated successfully!");
      setTimeout(() => {
        navigate(`/post/${id}`);
      }, 500);
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Failed to update post. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 pt-20 sm:pt-24">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Edit Post
          </h1>
          <p className="text-gray-600 text-lg">
            Update your post content and settings
          </p>
        </div>

        {/* Form */}
        <PostForm onSubmit={handleSubmit} initialData={post} />
      </div>
    </div>
  );
};

export default EditPost;
