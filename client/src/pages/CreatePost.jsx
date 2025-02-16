import PostForm from "../components/PostForm";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const navigate = useNavigate();

  const handleSubmit = async (postData) => {
    try {
      await axios.post("http://localhost:5000/api/posts", postData);
      navigate("/");
    } catch (error) {
      console.log("Error creating post:", error);
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
