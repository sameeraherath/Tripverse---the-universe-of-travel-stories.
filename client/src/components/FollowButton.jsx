import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import {
  followUser,
  unfollowUser,
  checkFollowStatus,
} from "../features/following/followingSlice";
import { UserPlus, UserMinus, Loader2 } from "lucide-react";

const FollowButton = ({ userId, variant = "default" }) => {
  const dispatch = useDispatch();
  const { followStatus, loading } = useSelector((state) => state.following);
  const currentUserId = useSelector((state) => state.auth.userId);
  const [isProcessing, setIsProcessing] = useState(false);

  const isFollowing = followStatus[userId] || false;

  // Debug: Check auth state
  console.log("FollowButton - Auth State:", {
    currentUserId,
    profileUserId: userId,
    isOwnProfile: String(currentUserId) === String(userId),
    shouldShowButton: currentUserId && String(currentUserId) !== String(userId),
  });

  useEffect(() => {
    if (userId && currentUserId && String(currentUserId) !== String(userId)) {
      dispatch(checkFollowStatus(userId));
    }
  }, [userId, dispatch, currentUserId]);

  const handleFollowToggle = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      if (isFollowing) {
        await dispatch(unfollowUser(userId)).unwrap();
      } else {
        await dispatch(followUser(userId)).unwrap();
      }
    } catch (error) {
      console.error("Follow action failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Don't show follow button for own profile
  if (!currentUserId) {
    return null;
  }

  if (String(currentUserId) === String(userId)) {
    return null;
  }

  if (variant === "compact") {
    return (
      <button
        onClick={handleFollowToggle}
        disabled={loading || isProcessing}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:-translate-y-0.5 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 ${
          isFollowing
            ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
            : "bg-gradient-primary text-white hover:opacity-90"
        }`}
      >
        {isProcessing || loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isFollowing ? (
          <>
            <UserMinus className="w-4 h-4" />
            <span>Unfollow</span>
          </>
        ) : (
          <>
            <UserPlus className="w-4 h-4" />
            <span>Follow</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleFollowToggle}
      disabled={loading || isProcessing}
      className={`group relative inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 ${
        isFollowing
          ? "bg-white border-2 border-orange-500 text-orange-500 hover:bg-orange-50"
          : "bg-gradient-primary text-white border border-gray-200 hover:opacity-90"
      }`}
    >
      {isProcessing || loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>{isFollowing ? "Unfollowing..." : "Following..."}</span>
        </>
      ) : isFollowing ? (
        <>
          <UserMinus className="w-5 h-5" />
          <span>Following</span>
        </>
      ) : (
        <>
          <UserPlus className="w-5 h-5" />
          <span>Follow</span>
        </>
      )}
    </button>
  );
};

FollowButton.propTypes = {
  userId: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(["default", "compact"]),
};

export default FollowButton;
