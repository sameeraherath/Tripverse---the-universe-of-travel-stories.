import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPosts,
  fetchRecommendations,
  setSearchTerm,
  setSortBy,
} from "../features/posts/postsSlice";
import Card from "../components/Card";
import SearchBar from "../components/SearchBar";
import { Sparkles, Loader2 } from "lucide-react";

const Home = () => {
  const dispatch = useDispatch();
  const { posts, loading, pagination, searchTerm, sortBy } = useSelector(
    (state) => state.post
  );
  const { token, userId } = useSelector((state) => state.auth);
  const isLoggedIn = !!token && !!userId;
  const [selectedTags, setSelectedTags] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (activeTab === "all") {
      dispatch(
        fetchPosts({
          search: searchTerm,
          sortBy,
          tags: selectedTags,
          page: 1,
        })
      );
    } else if (activeTab === "forYou" && isLoggedIn) {
      dispatch(fetchRecommendations({ page: 1, limit: 10 }));
    }
  }, [dispatch, searchTerm, sortBy, selectedTags, activeTab, isLoggedIn]);

  const handleSearch = (search) => {
    dispatch(setSearchTerm(search));
  };

  const handleSort = (sort) => {
    dispatch(setSortBy(sort));
  };

  const handleTagClick = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleLoadMore = () => {
    if (pagination.hasMore && !loading) {
      if (activeTab === "all") {
        dispatch(
          fetchPosts({
            search: searchTerm,
            sortBy,
            tags: selectedTags,
            page: pagination.currentPage + 1,
          })
        );
      } else if (activeTab === "forYou") {
        dispatch(
          fetchRecommendations({
            page: pagination.currentPage + 1,
            limit: 10,
          })
        );
      }
    }
  };

  const handleTabChange = (tab) => {
    if (tab === "forYou" && !isLoggedIn) {
      // Show alert or do nothing if not logged in
      alert("Please login to see personalized recommendations");
      return;
    }
    setActiveTab(tab);
    setSelectedTags([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/30 to-white">
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-primary rounded-full text-white font-medium border border-gray-200 mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Discover Amazing Stories</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-dark mb-4">
            Latest Stories
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Explore inspiring stories, insightful articles, and creative content
            from our community
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} onSort={handleSort} />
        </div>

        {/* Tabs */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex bg-white rounded-full p-1 shadow-sm border border-gray-200">
            <button
              onClick={() => handleTabChange("all")}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                activeTab === "all"
                  ? "bg-gradient-primary text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleTabChange("forYou")}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === "forYou"
                  ? "bg-gradient-primary text-white shadow-md"
                  : isLoggedIn
                  ? "text-gray-600 hover:text-gray-900"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              For You
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="w-full">
          {/* Posts Grid */}
          <div>
            {/* Selected Filters Display */}
            {activeTab === "all" && selectedTags.length > 0 && (
              <div className="mb-6 flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-gray-600">
                  Filters:
                </span>
                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
                  >
                    {tag}
                    <button
                      onClick={() => handleTagClick(tag)}
                      className="hover:bg-orange-200 rounded-full p-0.5"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Posts Grid */}
            {loading ? (
              <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Card key={index} />
                ))}
              </div>
            ) : posts.length > 0 ? (
              <>
                <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {posts.map((post) => (
                    <Card key={post._id} post={post} />
                  ))}
                </div>

                {/* Load More Button */}
                {pagination.hasMore && (
                  <div className="flex justify-center mt-12">
                    <button
                      onClick={handleLoadMore}
                      disabled={loading}
                      className="group relative px-8 py-4 bg-white border-2 border-orange-500 text-orange-500 font-semibold rounded-full hover:bg-orange-500 hover:text-white transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-orange-500"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Loading...
                        </span>
                      ) : (
                        <span>Load More Posts</span>
                      )}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <div className="text-8xl mb-6">
                  {activeTab === "forYou" ? "✨" : "📖"}
                </div>
                <h3 className="text-2xl font-bold text-gray-dark mb-3">
                  {activeTab === "forYou"
                    ? "No Recommendations Yet"
                    : "No Posts Yet"}
                </h3>
                <p className="text-gray-medium mb-6">
                  {activeTab === "forYou"
                    ? "Follow authors and bookmark posts to get personalized recommendations!"
                    : "Be the first to share your story with the community!"}
                </p>
                <a
                  href="/create"
                  className="inline-block px-8 py-3 bg-gradient-primary text-white font-semibold rounded-full border border-gray-200 transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  Create Your First Post
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
