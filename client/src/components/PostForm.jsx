import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import RichTextEditor from "./RichTextEditor";
import TagInput from "./TagInput";
import { Sparkles } from "lucide-react";

const PostForm = ({ onSubmit, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [tags, setTags] = useState(initialData?.tags || []);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  // AI Assistance Functions

  const handleGenerateContent = async () => {
    setGenerating(true);

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/ai/generate`,
        { prompt: title || "Write a blog post" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setContent(response.data.content);
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when the form is submitted

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("tags", JSON.stringify(tags));

    if (image) {
      formData.append("image", image);
    } else if (initialData?.image) {
      formData.append("image", initialData.image);
    }

    try {
      // Only call the onSubmit function passed as a prop
      await onSubmit(formData); // Assuming onSubmit is an async function
    } catch (error) {
      console.error("Error submitting form", error);
    } finally {
      setLoading(false); // Set loading to false after form submission
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-2 border border-gray-light bg-gray-lightest rounded-3xl px-4 focus:outline-none focus:ring-2 focus:ring-primary/20 text-gray-dark placeholder-gray-medium transition-all"
        />
      </div>

      {/* Tags Input */}
      <TagInput tags={tags} onChange={setTags} />

      {/* Rich Text Editor */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Content
        </label>
        <RichTextEditor
          content={content}
          onChange={setContent}
          placeholder="Start writing your amazing blog post..."
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Featured Image
        </label>
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full p-2 px-4 border-none rounded-3xl focus:outline-none file:bg-gradient-primary file:py-2 file:px-4 file:border-none file:mr-4 file:text-white file:font-semibold file:hover:opacity-90 file:transition"
          accept="image/*"
        />
      </div>

      <div className="flex flex-col gap-4">
        <button
          type="button"
          className="w-full p-3 bg-white border-2 border-primary text-primary font-semibold focus:outline-none rounded-3xl hover:bg-primary hover:text-white transition disabled:opacity-60 shadow-sm flex items-center justify-center gap-2"
          onClick={handleGenerateContent}
          disabled={loading || generating}
        >
          <Sparkles className="w-5 h-5" />
          {generating ? "Generating with AI..." : "Generate Content with AI"}
        </button>

        <button
          type="submit"
          className="w-full p-3 bg-gradient-primary text-white font-semibold rounded-3xl hover:shadow-lg transition disabled:opacity-60 shadow-sm"
          disabled={loading}
        >
          {loading ? "Publishing..." : "Publish Post"}
        </button>
      </div>
    </form>
  );
};

PostForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object,
};

export default PostForm;
