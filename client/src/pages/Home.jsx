import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/posts`)
      .then((response) => setPosts(response.data))
      .catch((error) => console.log(error));
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">All Posts</h2>
      <div className="grid gap-4">
        {posts.map((post) => (
          <div key={post._id} className="bg-white shadow-md rounded p-4">
            <h3 className="text-xl font-semibold">{post.title}</h3>
            <p className="text-gray-600">{post.content.substring(0, 100)}</p>
            <Link
              to={`/post/${post._id}`}
              className="text-blue-500 hover:underline"
            >
              Read More
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
