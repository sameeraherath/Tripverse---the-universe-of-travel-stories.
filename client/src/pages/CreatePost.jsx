import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createPost } from "../features/posts/postsSlice";
import PostForm from "../components/PostForm";
import { toast } from "react-toastify";

const CreatePost = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.post);

  const handleSubmit = async (formData) => {
    try {
      const resultAction = await dispatch(createPost(formData));

      if (createPost.fulfilled.match(resultAction)) {
        toast.success("Post created successfully!");
        setTimeout(() => {
          navigate("/home");
        }, 500);
      } else if (createPost.rejected.match(resultAction)) {
        toast.error("Failed to create post. Please try again.");
      }
    } catch (err) {
      console.error("Error creating post:", err);
      toast.error("Failed to create post. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-600 font-medium">Creating your post...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 pt-20 sm:pt-24">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Create New Post
          </h1>
          <p className="text-gray-600 text-lg">
            Share your thoughts and ideas with the community
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Form */}
        <PostForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default CreatePost;
