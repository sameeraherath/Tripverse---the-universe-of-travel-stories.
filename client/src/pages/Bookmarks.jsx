import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getBookmarkedPosts } from "../features/posts/postsSlice";
import Card from "../components/Card";
import { Bookmark, Loader2 } from "lucide-react";

const Bookmarks = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { posts, loading } = useSelector((state) => state.post);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token) {
      navigate("/LoginPage");
      return;
    }

    dispatch(getBookmarkedPosts());
  }, [dispatch, token, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50/30 to-white flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/30 to-white">
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-primary rounded-full text-white font-medium border border-gray-200 mb-4">
            <Bookmark className="w-4 h-4" fill="currentColor" />
            <span>Your Bookmarks</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-dark mb-4">
            Saved Posts
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            All your bookmarked posts in one place
          </p>
        </div>

        {/* Bookmarked Posts Grid */}
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
          <div className="text-center py-20">
            <div className="text-8xl mb-6">🔖</div>
            <h3 className="text-2xl font-bold text-gray-dark mb-3">
              No Bookmarks Yet
            </h3>
            <p className="text-gray-medium mb-6">
              Start bookmarking posts you want to read later!
            </p>
            <button
              onClick={() => navigate("/home")}
              className="inline-block px-8 py-3 bg-gradient-primary text-white font-semibold rounded-full border border-gray-200 transform hover:-translate-y-0.5 transition-all duration-300"
            >
              Explore Posts
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
