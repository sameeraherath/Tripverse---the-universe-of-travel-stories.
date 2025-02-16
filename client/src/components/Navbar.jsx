import { Link } from "react-router-dom";

const Navbar = () => {
  <nav className="bg-black text-white p-4">
    <div className="container mx-auto flex justify-between items-center">
      <h1 className="text-2xl font-bold">
        <Link to="/">Blogger</Link>
      </h1>
      <ul className="flex space-x-4">
        <li>
          <Link to="/" className="hover:text-gray-400">
            Home
          </Link>
        </li>
        <li>
          <Link to="/create" className="hover:text-gray-400">
            Create
          </Link>
        </li>
      </ul>
    </div>
  </nav>;
};

export default Navbar;
