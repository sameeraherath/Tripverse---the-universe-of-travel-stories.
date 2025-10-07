import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getPostComments,
  clearComments,
} from "../features/comments/commentsSlice";
import Comment from "../components/Comment";
import CommentForm from "../components/CommentForm";
import api from "../utils/api";
import {
  Share2,
  Edit2,
  Trash2,
  Calendar,
  Heart,
  MessageCircle,
  ArrowLeft,
} from "lucide-react";

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [authorProfile, setAuthorProfile] = useState(null);
  const dispatch = useDispatch();
  const { comments, isLoading: commentsLoading } = useSelector(
    (state) => state.comments
  );

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/posts/${id}`);

        setPost(response.data);
        dispatch(getPostComments(id));

        if (response.data.author) {
          const profileResponse = await api.get(
            `/api/profile/user/${response.data.author._id}`
          );
          setAuthorProfile(profileResponse.data);
        }

        const token = localStorage.getItem("authToken");
        if (token) {
          const decodedToken = JSON.parse(atob(token.split(".")[1]));
          setUserId(decodedToken.userId);
        }

        setLoading(false);
      } catch (error) {
        setError(
          error.response?.data?.message || "Error fetching post details"
        );
        setLoading(false);
      }
    };

    fetchPostDetails();
    return () => {
      dispatch(clearComments());
    };
  }, [id, dispatch]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/api/posts/${id}`);
      navigate("/home");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.content.substring(0, 100),
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Error Loading Post
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/home")}
            className="px-6 py-2 bg-gradient-primary text-white rounded-full hover:shadow-lg transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">📖</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Post Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The post you&apos;re looking for doesn&apos;t exist.
          </p>
          <button
            onClick={() => navigate("/home")}
            className="px-6 py-2 bg-gradient-primary text-white rounded-full hover:shadow-lg transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/30 to-white py-24">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-6 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Posts
        </button>

        {/* Main Content Card */}
        <article className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Featured Image */}
          {post.image && (
            <div className="relative h-96 overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
          )}

          <div className="p-8 md:p-12">
            {/* Author Info */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xl font-bold">
                  {authorProfile?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {authorProfile ? authorProfile.name : "Unknown User"}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {userId && post.author && userId === post.author._id && (
                  <>
                    <Link
                      to={`/edit/${id}`}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Edit</span>
                    </Link>
                    <button
                      onClick={handleDelete}
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </>
                )}
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Share</span>
                </button>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Stats */}
            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
              <div className="flex items-center gap-2 text-gray-600">
                <Heart className="w-5 h-5" />
                <span className="font-medium">{post.likeCount || 0} likes</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">{comments.length} comments</span>
              </div>
            </div>

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none mb-12 rich-text-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>

        {/* Comments Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <MessageCircle className="w-8 h-8 text-primary" />
            Comments ({comments.length})
          </h2>

          <div className="mb-8">
            <CommentForm postId={id} />
          </div>

          {commentsLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading comments...</p>
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <Comment key={comment._id} comment={comment} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                No comments yet. Be the first to comment!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
