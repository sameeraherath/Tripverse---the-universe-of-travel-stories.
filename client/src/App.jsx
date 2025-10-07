import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import PostDetails from "./pages/PostDetails";
import LoginPage from "./pages/Auth/LoginPage";
import MagicLogin from "./pages/Auth/MagicLogin";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import LandingPage from "./pages/LandingPage";
const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

const AppContent = () => {
  const location = useLocation();
  return (
    <div>
      {location.pathname !== "/LoginPage" && location.pathname !== "/" && (
        <Navbar />
      )}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/edit/:id" element={<EditPost />} />
        <Route path="/post/:id" element={<PostDetails />} />
        <Route path="/magic-login/:token" element={<MagicLogin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:userId" element={<UserProfile />} />
      </Routes>
    </div>
  );
};

export default App;
