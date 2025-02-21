import { PencilLine, LogOut } from "lucide-react";
import { logout } from "../utils/authService";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <nav className="bg-stone-950 text-white fixed w-full z-50 shadow-md">
      <div className="w-full px-4 md:px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <button onClick={() => navigate("/home")} className="px-4 md:px-8">
            Blogger
          </button>
        </h1>
        <ul className="flex space-x-4">
          <li>
            <button
              onClick={() => navigate("/create")}
              className="hover:text-gray-100 px-4 md:px-8 py-4"
            >
              <PencilLine size={24} />
            </button>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="hover:text-gray-100 px-4 md:px-8 py-4"
            >
              <LogOut size={24} />
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
