import PostForm from "../components/PostForm";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/posts`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/home");
    } catch (error) {
      console.log("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Create New Post</h2>
      <PostForm onSubmit={handleSubmit} />
    </div>
  );
};

export default CreatePost;
