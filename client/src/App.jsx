import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import PostDetails from "./pages/PostDetails";
import { useState } from "react";
import LoginPage from "./pages/Auth/LoginPage";
import MagicLogin from "./pages/Auth/MagicLogin";
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };
  return (
    <Router>
      {isAuthenticated && <Navbar />}
      <div className="container mx-auto p-4">
        <Routes>
          <Route
            path="/"
            element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
          />
          <Route path="/home" element={<Home />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/edit/:id" element={<EditPost />} />
          <Route path="/post/:id" element={<PostDetails />} />
          <Route
            path="/magic-login/:token"
            element={<MagicLogin onLoginSuccess={handleLoginSuccess} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
