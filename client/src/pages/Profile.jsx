import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/api/profile");
        setName(response.data.name);
        setBio(response.data.bio);
        setPreview(response.data.avatar); // Load existing avatar
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    setPreview(URL.createObjectURL(file)); // Create preview URL
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("bio", bio);
    if (avatar) formData.append("avatar", avatar);

    try {
      await axios.put("/api/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/profile"); // Redirect to profile after update
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-16 px-8 pt-28">
      <div className="  bg-neutral-900 shadow-xl rounded-3xl p-8 px-4 ">
        <h2 className="text-center text-2xl font-semibold mb-6">
          Update Profile
        </h2>

        {/* Avatar Preview */}
        <div className="flex justify-center mb-4">
          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-neutral-600">
            <img
              src={preview || "https://via.placeholder.com/150"}
              alt="Avatar Preview"
              className="w-full h-full object-cover border border-neutral-600"
            />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-neutral-600 rounded-3xl px-4 focus:outline-none"
            />
          </div>

          {/* Bio Textarea */}
          <div>
            <textarea
              placeholder="Bio"
              maxLength={80}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full h-16 p-3 border border-neutral-600 rounded-lg resize-none focus:outline-none"
            />
          </div>

          {/* Avatar Upload */}
          <div>
            <input
              type="file"
              onChange={handleAvatarChange}
              className="w-80 p-2 px-4 border-none  rounded-3xl focus:outline-none file:bg-stone-800 file:py-2 file:px-4 file:border-none file:mr-4 "
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full p-3 bg-stone-800 text-white   focus:outline-none rounded-3xl"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
