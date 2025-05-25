import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../features/posts/postsSlice";
import Card from "../components/Card";

const Home = () => {
  const dispatch = useDispatch();
  const { posts, loading } = useSelector((state) => state.post);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-6xl font-bold mb-6 mt-12 text-center text-gray-dark py-2 pt-8">
        Latest Blog Posts
      </h2>
      <p className="text-gray-medium text-center pb-4">
        Exploring the latest blog posts and post your thoughts using AI
      </p>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => <Card key={index} />)
          : posts.map((post) => (
              <Card
                key={post._id}
                post={{
                  ...post,
                  image: post.image || null,
                }}
              />
            ))}
      </div>
    </div>
  );
};

export default Home;
