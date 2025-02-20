import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-black text-white p-4 fixed w-full">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link to="/home">Blogger</Link>
        </h1>
        <ul className="flex space-x-4">
          <li>
            <Link to="/home" className="hover:text-gray-400">
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
    </nav>
  );
};

export default Navbar;
