import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Calendar, Mail, Edit, Users, UserPlus, Loader2 } from "lucide-react";
import api from "../utils/api";
import Card from "../components/Card";
import FollowButton from "../components/FollowButton";
import FollowListModal from "../components/FollowListModal";

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user);

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState(null); // 'followers' or 'following'

  const isOwnProfile = currentUser?._id === userId;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const [profileRes, postsRes] = await Promise.all([
          api.get(`/api/profile/user/${userId}`),
          api.get(`/api/posts?author=${userId}`),
        ]);

        setProfile(profileRes.data);
        setPosts(postsRes.data.posts || postsRes.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        if (error.response?.status === 404) {
          navigate("/");
        }
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50/30 to-white flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50/30 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-6">😕</div>
          <h2 className="text-2xl font-bold text-gray-dark mb-3">
            Profile Not Found
          </h2>
          <p className="text-gray-medium mb-6">
            This user profile doesn&apos;t exist.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-gradient-primary text-white font-semibold rounded-full hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(profile.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/30 to-white py-24">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Profile Header Card */}
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100 mb-8">
          {/* Cover Image */}
          <div className="h-48 bg-gradient-primary relative"></div>

          {/* Profile Info */}
          <div className="relative px-8 pb-8">
            {/* Avatar */}
            <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-20 md:-mt-16">
              <div className="relative">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name || "User"}
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-xl"
                  />
                ) : (
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-5xl border-4 border-white shadow-xl">
                    {(profile.name ||
                      profile.user?.email ||
                      "U")[0].toUpperCase()}
                  </div>
                )}
              </div>

              {/* Name and Actions */}
              <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-dark mb-2">
                    {profile.name || "Anonymous User"}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-medium">
                    <Mail className="w-4 h-4" />
                    <span>{profile.user?.email}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {isOwnProfile ? (
                    <button
                      onClick={() => navigate("/profile")}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-primary text-white font-semibold rounded-full hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <Edit className="w-5 h-5" />
                      <span>Edit Profile</span>
                    </button>
                  ) : (
                    <FollowButton userId={userId} />
                  )}
                </div>
              </div>
            </div>

            {/* Bio */}
            {profile.bio && (
              <div className="mt-6 mb-6">
                <p className="text-gray-600 text-lg leading-relaxed">
                  {profile.bio}
                </p>
              </div>
            )}

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-gray-100">
              <button
                onClick={() => setModalType("followers")}
                className="group flex items-center gap-2 hover:text-orange-500 transition-colors"
              >
                <Users className="w-5 h-5 text-gray-400 group-hover:text-orange-500" />
                <span className="font-semibold text-gray-dark group-hover:text-orange-500">
                  {profile.followerCount || 0}
                </span>
                <span className="text-gray-medium">Followers</span>
              </button>

              <button
                onClick={() => setModalType("following")}
                className="group flex items-center gap-2 hover:text-orange-500 transition-colors"
              >
                <UserPlus className="w-5 h-5 text-gray-400 group-hover:text-orange-500" />
                <span className="font-semibold text-gray-dark group-hover:text-orange-500">
                  {profile.followingCount || 0}
                </span>
                <span className="text-gray-medium">Following</span>
              </button>

              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-gray-medium">Joined {formattedDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-dark mb-6">
            {isOwnProfile ? "Your Posts" : `Posts by ${profile.name || "User"}`}
          </h2>

          {posts.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Card
                  key={post._id}
                  post={{
                    ...post,
                    image: post.image || null,
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
              <div className="text-8xl mb-6">📝</div>
              <h3 className="text-2xl font-bold text-gray-dark mb-3">
                No Posts Yet
              </h3>
              <p className="text-gray-medium">
                {isOwnProfile
                  ? "Start sharing your stories with the community!"
                  : "This user hasn't posted anything yet."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Follow List Modal */}
      <FollowListModal
        userId={userId}
        type={modalType}
        isOpen={!!modalType}
        onClose={() => setModalType(null)}
      />
    </div>
  );
};

export default UserProfile;
