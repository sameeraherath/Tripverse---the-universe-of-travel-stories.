import { useState, useEffect } from "react";
import PostForm from "../components/PostForm";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({ title: "", content: "" });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/posts/${id}`
        );
        setPost(response.data);
        navigate`/post/${id}`;
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [id, navigate]);

  const handleSubmit = async (updatedData) => {
    try {
      await axios.put(`http://localhost:5000/api/posts/${id}`, updatedData);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Edit Post</h2>
      <PostForm onSubmit={handleSubmit} initialData={post} />
    </div>
  );
};

export default EditPost;
