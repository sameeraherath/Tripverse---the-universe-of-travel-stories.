import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createPost } from "../features/posts/postsSlice";
import PostForm from "../components/PostForm";

const CreatePost = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.post);

  const handleSubmit = async (formData) => {
    const resultAction = await dispatch(createPost(formData));
    if (createPost.isFulfilled.match(resultAction)) {
      navigate("/home");
    } else {
      alert("Failed to create post. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-2xl py-16 px-8 flex justify-center items-center">
        <p className="text-gray-500">Creating post...</p>
      </div>
    );
  }
  return (
    <div className="container mx-auto max-w-2xl py-16 px-8">
      <h2 className="text-3xl font-bold mb-4 pb-6 pt-24">Create New Post</h2>
      {error && <p className="text-red-500">{error}</p>}
      <PostForm onSubmit={handleSubmit} />
    </div>
  );
};

export default CreatePost;
