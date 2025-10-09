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
import SignUpPage from "./pages/Auth/SignUpPage";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import Bookmarks from "./pages/Bookmarks";
import Notifications from "./pages/Notifications";
import Messages from "./pages/Messages";
import LandingPage from "./pages/LandingPage";
import FloatingActionButton from "./components/FloatingActionButton";
import { SocketProvider } from "./contexts/SocketContext";

const App = () => {
  return (
    <Router>
      <SocketProvider>
        <AppContent />
      </SocketProvider>
    </Router>
  );
};

const AppContent = () => {
  const location = useLocation();
  const hideNavbarPaths = ["/login", "/signup", "/"];

  return (
    <div>
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/edit/:id" element={<EditPost />} />
        <Route path="/post/:id" element={<PostDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:userId" element={<UserProfile />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/messages" element={<Messages />} />
      </Routes>
      {!hideNavbarPaths.includes(location.pathname) && <FloatingActionButton />}
    </div>
  );
};

export default App;
