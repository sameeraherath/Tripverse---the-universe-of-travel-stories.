import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { Slide, ToastContainer, toast } from "react-toastify";
import { Camera } from "lucide-react";
import api from "../utils/api";

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
        const response = await api.get("/api/profile");
        const { name, bio, avatar } = response.data;
        setName(name || "");
        setBio(bio || "");
        setPreview(avatar || "/profile-picture.png");
      } catch (error) {
        console.error("Error fetching profile:", error);
        if (error.response?.status === 401) {
          navigate("/LoginPage");
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("bio", bio);
    if (avatar) formData.append("avatar", avatar);

    try {
      await api.put("/api/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Successfully updated profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/30 to-white py-24">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="bg-white shadow-2xl rounded-2xl p-8 md:p-12 border border-gray-100">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Edit Profile
          </h2>

          {/* Avatar Preview */}
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 bg-gray-100 shadow-lg">
                <img
                  src={preview || "/profile-picture.png"}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <label
                htmlFor="avatarInput"
                className="absolute bottom-2 right-2 bg-gradient-primary p-3 rounded-full cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
              >
                <Camera className="w-5 h-5 text-white" />
              </label>
              <input
                type="file"
                id="avatarInput"
                className="hidden"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Display Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-4 border border-gray-200 bg-gray-50 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all"
              />
            </div>

            {/* Bio Textarea */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                placeholder="Tell us about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-4 border border-gray-200 bg-gray-50 rounded-xl px-4 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all"
                rows="4"
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">
                  {bio.length}/500 characters
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-primary text-white py-4 px-6 rounded-xl font-bold shadow-lg disabled:opacity-50 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 text-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating...
                  </span>
                ) : (
                  "Save Changes"
                )}
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
    </div>
  );
};

export default Profile;
