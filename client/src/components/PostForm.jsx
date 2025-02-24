import { useState } from "react";
import PropTypes from "prop-types";

const PostForm = ({ onSubmit, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    if (image) {
      formData.append("image", image);
    } else if (initialData?.image) {
      formData.append("image", initialData.image);
    }

    // Only call the onSubmit function passed as a prop
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full p-2 border border-neutral-600 rounded-3xl px-4 focus:outline-none"
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        className="w-full h-36 p-3 border border-neutral-600  rounded-lg resize-none focus:outline-none"
      />
      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
        className="w-80 p-2 px-4 border-none  rounded-3xl focus:outline-none file:bg-stone-800 file:py-2 file:px-4 file:border-none file:mr-4 "
        accept="image/*"
      />
      <button
        type="submit"
        className="bg-stone-800 text-white py-2 px-10 mx-4 rounded-3xl"
      >
        Post
      </button>
    </form>
  );
};

PostForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object,
};

export default PostForm;
