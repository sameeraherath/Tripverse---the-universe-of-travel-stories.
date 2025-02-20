import { Link } from "react-router-dom";
import { PencilLine } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-stone-950 text-white fixed w-full z-50 shadow-md">
      <div className="w-full px-4 md:px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link to="/home" className="px-4 md:px-8">
            Blogger
          </Link>
        </h1>
        <ul className="flex space-x-4">
          <li>
            <Link to="/create" className="hover:text-gray-100 px-4 md:px-8">
              <PencilLine size={24} />
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
