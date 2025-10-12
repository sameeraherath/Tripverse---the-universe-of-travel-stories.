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
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState(
    initialData?.images || []
  );
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  // AI Assistance Functions

  const handleFixGrammar = async () => {
    if (!content.trim()) {
      alert("Please write some content first before fixing grammar mistakes.");
      return;
    }

    setGenerating(true);

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/ai/fix-grammar`,
        { content: content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.data.content) {
        setContent(response.data.content);
      }
      
      if (response.data.warning) {
        console.warn("AI grammar check warning:", response.data.warning);
        // You could show a toast notification here if you have a toast system
      }
      
      if (response.data.error) {
        console.warn("AI grammar check error:", response.data.error);
        alert(response.data.error);
      }
    } catch (error) {
      console.error("Error fixing grammar:", error);
      alert("Failed to fix grammar. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = existingImages.length + images.length + files.length;

    if (totalImages > 3) {
      alert("You can only upload a maximum of 3 images");
      return;
    }

    setImages([...images, ...files]);
  };

  const removeExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when the form is submitted

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("tags", JSON.stringify(tags));

    // Append existing images (for edit mode)
    if (existingImages.length > 0) {
      formData.append("existingImages", JSON.stringify(existingImages));
    }

    // Append new images
    images.forEach((image) => {
      formData.append("images", image);
    });

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
          Images (Maximum 3)
        </label>

        {/* Display existing images */}
        {existingImages.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-3">
            {existingImages.map((img, index) => (
              <div key={`existing-${index}`} className="relative group">
                <img
                  src={img}
                  alt={`Existing ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Display newly selected images */}
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-3">
            {images.map((img, index) => (
              <div key={`new-${index}`} className="relative group">
                <img
                  src={URL.createObjectURL(img)}
                  alt={`New ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeNewImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* File input - only show if less than 3 images */}
        {existingImages.length + images.length < 3 && (
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full p-2 px-4 border-none rounded-3xl focus:outline-none file:bg-gradient-primary file:py-2 file:px-4 file:border-none file:mr-4 file:text-white file:font-semibold file:hover:opacity-90 file:transition"
            accept="image/*"
            multiple
          />
        )}

        <p className="text-xs text-gray-500 mt-1">
          {existingImages.length + images.length} of 3 images selected
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <button
          type="button"
          className="w-full p-3 bg-white border-2 border-primary text-primary font-semibold focus:outline-none rounded-3xl hover:bg-primary hover:text-white transition disabled:opacity-60 flex items-center justify-center gap-2"
          onClick={handleFixGrammar}
          disabled={loading || generating}
        >
          <Sparkles className="w-5 h-5" />
          {generating ? "AI is helping..." : "Fix Mistakes with AI"}
        </button>

        <button
          type="submit"
          className="w-full p-3 bg-gradient-primary text-white font-semibold rounded-3xl border border-gray-200 transition disabled:opacity-60"
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
