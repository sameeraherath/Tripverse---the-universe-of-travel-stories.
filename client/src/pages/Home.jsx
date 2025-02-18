import { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card";
import SkeletonCard from "../components/SkeletonCard";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/posts`)
      .then((response) => setPosts(response.data))
      .then(() => setLoading(false))
      .catch((error) => console.log(error));
  }, [setLoading]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-4xl font-bold mb-4 mt-20 text-center">
        Latest Blog Posts
      </h2>
      <p className="text-gray-700 text-center pb-4">
        Exploring the latest blog posts and post your thoughts using AI
      </p>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2  lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
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
