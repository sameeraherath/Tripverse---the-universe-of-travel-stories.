import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/api/profile");
        setName(response.data.name);
        setBio(response.data.bio);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("bio", bio);
    if (avatar) formData.append("avatar", avatar);

    try {
      await axios.put("/api/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/Profile");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="">
      <h2>Update Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        ></textarea>
        <input type="file" onChange={(e) => setAvatar(e.target.files[0])} />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default Profile;
