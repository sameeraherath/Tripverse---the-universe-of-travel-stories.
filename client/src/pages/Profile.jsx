import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { Slide, ToastContainer, toast } from "react-toastify";
import { Camera } from "lucide-react";

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
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("Token not found");
        }
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { name, bio, avatar } = response.data;
        setName(name || "");
        setBio(bio || "");
        setPreview(avatar || "/profile-picture.png"); // Load existing avatar
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
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }
      await axios.put(`${import.meta.env.VITE_API_URL}/api/profile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/profile"); // Redirect to profile after update
      toast.success("Successfully updated profile");
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-16 px-8 pt-28">
      <div className="bg-white shadow-xl rounded-3xl p-8 px-4">
        {/* Avatar Preview */}
        <div className="flex justify-center mb-4">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-lightest relative bg-gray-lightest">
            <img
              src={preview || "/profile-picture.png"}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
            <label
              htmlFor="avatarInput"
              className="absolute bottom-2 right-2 bg-white border border-gray-light p-2 rounded-full cursor-pointer shadow-sm hover:bg-gray-lightest transition"
            >
              <Camera className="w-4 h-4 text-primary" />
            </label>
            <input
              type="file"
              id="avatarInput"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div className="flex justify-center">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-2 border border-gray-light bg-gray-lightest rounded-3xl px-4 focus:outline-none text-center text-gray-dark placeholder-gray-medium w-80"
            />
          </div>

          {/* Bio Textarea */}
          <div className="flex justify-center">
            <textarea
              placeholder="Write something about yourself."
              maxLength={80}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-80 h-16 p-3 border border-gray-light bg-gray-lightest rounded-3xl resize-none focus:outline-none text-center text-gray-dark placeholder-gray-medium"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-80 p-3 bg-gradient-to-r from-primary to-primary-light text-white font-semibold focus:outline-none rounded-3xl shadow hover:opacity-90 transition disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer
        position="bottom-center"
        hideProgressBar={true}
        theme="light"
        transition={Slide}
      />
    </div>
  );
};

export default Profile;
