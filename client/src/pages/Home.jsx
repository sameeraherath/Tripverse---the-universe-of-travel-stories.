import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../features/posts/postsSlice";
import Card from "../components/Card";
import { Sparkles } from "lucide-react";

const Home = () => {
  const dispatch = useDispatch();
  const { posts, loading } = useSelector((state) => state.post);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/30 to-white">
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-primary rounded-full text-white font-medium shadow-lg mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Discover Amazing Stories</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-dark mb-4">
            Latest Blog Posts
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Explore inspiring stories, insightful articles, and creative content
            from our community
          </p>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} />
            ))}
          </div>
        ) : posts.length > 0 ? (
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
            <div className="text-8xl mb-6">📖</div>
            <h3 className="text-2xl font-bold text-gray-dark mb-3">
              No Posts Yet
            </h3>
            <p className="text-gray-medium mb-6">
              Be the first to share your story with the community!
            </p>
            <a
              href="/create"
              className="inline-block px-8 py-3 bg-gradient-primary text-white font-semibold rounded-full hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
            >
              Create Your First Post
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
