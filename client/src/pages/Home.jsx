import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPosts,
  setSearchTerm,
  setSortBy,
} from "../features/posts/postsSlice";
import Card from "../components/Card";
import SearchBar from "../components/SearchBar";
import TagCloud from "../components/TagCloud";
import { Sparkles, Loader2 } from "lucide-react";

const Home = () => {
  const dispatch = useDispatch();
  const { posts, loading, pagination, searchTerm, sortBy } = useSelector(
    (state) => state.post
  );
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    dispatch(
      fetchPosts({
        search: searchTerm,
        sortBy,
        tags: selectedTags,
        page: 1,
      })
    );
  }, [dispatch, searchTerm, sortBy, selectedTags]);

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
      dispatch(
        fetchPosts({
          search: searchTerm,
          sortBy,
          tags: selectedTags,
          page: pagination.currentPage + 1,
        })
      );
    }
  };

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

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} onSort={handleSort} />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Posts Grid - Takes 3 columns */}
          <div className="lg:col-span-3">
            {/* Selected Filters Display */}
            {selectedTags.length > 0 && (
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
                    <Card
                      key={post._id}
                      post={{
                        ...post,
                        image: post.image || null,
                      }}
                    />
                  ))}
                </div>

                {/* Load More Button */}
                {pagination.hasMore && (
                  <div className="flex justify-center mt-12">
                    <button
                      onClick={handleLoadMore}
                      disabled={loading}
                      className="group relative px-8 py-4 bg-white border-2 border-orange-500 text-orange-500 font-semibold rounded-full hover:bg-orange-500 hover:text-white transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-orange-500"
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

          {/* Sidebar - Takes 1 column */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <TagCloud
                onTagClick={handleTagClick}
                selectedTags={selectedTags}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
