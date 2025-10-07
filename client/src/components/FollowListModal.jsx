import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import {
  getFollowers,
  getFollowing,
} from "../features/following/followingSlice";
import { Users, UserPlus, Loader2, X } from "lucide-react";
import FollowButton from "./FollowButton";

const FollowListModal = ({ userId, type, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { followers, following, loading } = useSelector(
    (state) => state.following
  );

  useEffect(() => {
    if (isOpen && userId) {
      if (type === "followers") {
        dispatch(getFollowers(userId));
      } else {
        dispatch(getFollowing(userId));
      }
    }
  }, [isOpen, userId, type, dispatch]);

  if (!isOpen) return null;

  const list = type === "followers" ? followers : following;
  const title = type === "followers" ? "Followers" : "Following";
  const Icon = type === "followers" ? Users : UserPlus;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] flex flex-col animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Icon className="w-5 h-5 text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-dark">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
          ) : list.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👥</div>
              <p className="text-gray-500 text-lg">
                No {title.toLowerCase()} yet
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {list.map((user) => {
                const profile = user.profile || {};
                return (
                  <div
                    key={user._id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    {/* Avatar */}
                    <a
                      href={`/profile/${user._id}`}
                      className="flex-shrink-0"
                    >
                      {profile.avatar ? (
                        <img
                          src={profile.avatar}
                          alt={profile.name || "User"}
                          className="w-12 h-12 rounded-full object-cover border-2 border-orange-200"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-lg">
                          {(profile.name || user.email || "U")[0].toUpperCase()}
                        </div>
                      )}
                    </a>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <a
                        href={`/profile/${user._id}`}
                        className="block hover:text-orange-500 transition-colors"
                      >
                        <h3 className="font-semibold text-gray-dark truncate">
                          {profile.name || "Anonymous User"}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                          {user.email}
                        </p>
                      </a>
                      {profile.bio && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                          {profile.bio}
                        </p>
                      )}
                    </div>

                    {/* Follow Button */}
                    <FollowButton userId={user._id} variant="compact" />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

FollowListModal.propTypes = {
  userId: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["followers", "following"]).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default FollowListModal;
