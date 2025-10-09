import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
} from "@mui/material";
import {
  Create,
  Logout,
  AccountCircle,
  Home,
  Bookmark,
  Menu as MenuIcon,
  Close as CloseIcon,
  Message,
  Badge,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../utils/authService";
import { fetchUnreadCount } from "../features/chat/chatSlice";
import NotificationDropdown from "./NotificationDropdown";
import api from "../utils/api";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userAvatar, setUserAvatar] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const { unreadCount } = useSelector((state) => state.chat);

  // Fetch user profile to get avatar
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get("/api/profile");
        if (response.data && response.data.avatar) {
          setUserAvatar(response.data.avatar);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  // Fetch unread message count
  useEffect(() => {
    dispatch(fetchUnreadCount());

    // Poll every 30 seconds
    const interval = setInterval(() => {
      dispatch(fetchUnreadCount());
    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
    setMobileMenuOpen(false); // Close mobile menu if open
  };

  const handleLogoutConfirm = () => {
    logout();
    setLogoutDialogOpen(false);
    navigate("/");
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const menuItems = [
    { text: "Home", path: "/home", icon: <Home /> },
    { text: "Create Post", path: "/create", icon: <Create /> },
    { text: "Bookmarks", path: "/bookmarks", icon: <Bookmark /> },
    { text: "Messages", path: "/messages", icon: <Message /> },
    { text: "Notifications", path: "/notifications", icon: <AccountCircle /> },
    {
      text: "Profile",
      path: "/profile",
      icon: userAvatar ? (
        <Avatar src={userAvatar} alt="Profile" sx={{ width: 24, height: 24 }} />
      ) : (
        <AccountCircle />
      ),
    },
  ];

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          boxShadow: "none",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <Toolbar
          sx={{ display: "flex", justifyContent: "space-between", py: 1 }}
        >
          <Typography
            variant="h4"
            component="button"
            onClick={() => navigate("/home")}
            sx={{
              background: "linear-gradient(135deg, #FF7A1A 0%, #FFB347 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontWeight: "800",
              border: "none",
              cursor: "pointer",
              fontSize: { xs: "1.5rem", md: "2rem" },
              letterSpacing: "0.5px",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.02)",
                filter: "brightness(1.1)",
              },
            }}
          >
            Tripverse
          </Typography>

          {/* Desktop Menu */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 1,
              alignItems: "center",
            }}
          >
            <Tooltip title="Home" arrow placement="bottom">
              <IconButton
                onClick={() => navigate("/home")}
                sx={{
                  color: isActive("/home") ? "#FF7A1A" : "#444444",
                  backgroundColor: isActive("/home")
                    ? "rgba(255, 122, 26, 0.1)"
                    : "transparent",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: "#FF7A1A",
                    backgroundColor: "rgba(255, 122, 26, 0.1)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Home sx={{ fontSize: { xs: "24px", md: "28px" } }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Create Post" arrow placement="bottom">
              <IconButton
                onClick={() => navigate("/create")}
                sx={{
                  color: isActive("/create") ? "#FF7A1A" : "#444444",
                  backgroundColor: isActive("/create")
                    ? "rgba(255, 122, 26, 0.1)"
                    : "transparent",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: "#FF7A1A",
                    backgroundColor: "rgba(255, 122, 26, 0.1)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Create sx={{ fontSize: { xs: "24px", md: "28px" } }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Bookmarks" arrow placement="bottom">
              <IconButton
                onClick={() => navigate("/bookmarks")}
                sx={{
                  color: isActive("/bookmarks") ? "#FF7A1A" : "#444444",
                  backgroundColor: isActive("/bookmarks")
                    ? "rgba(255, 122, 26, 0.1)"
                    : "transparent",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: "#FF7A1A",
                    backgroundColor: "rgba(255, 122, 26, 0.1)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Bookmark sx={{ fontSize: { xs: "24px", md: "28px" } }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Messages" arrow placement="bottom">
              <IconButton
                onClick={() => navigate("/messages")}
                sx={{
                  color: isActive("/messages") ? "#FF7A1A" : "#444444",
                  backgroundColor: isActive("/messages")
                    ? "rgba(255, 122, 26, 0.1)"
                    : "transparent",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: "#FF7A1A",
                    backgroundColor: "rgba(255, 122, 26, 0.1)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Badge badgeContent={unreadCount} color="error">
                  <Message sx={{ fontSize: { xs: "24px", md: "28px" } }} />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Notification Dropdown */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                "& > div": {
                  display: "flex",
                  alignItems: "center",
                },
              }}
            >
              <NotificationDropdown />
            </Box>

            <Tooltip title="Profile" arrow placement="bottom">
              <IconButton
                onClick={() => navigate("/profile")}
                sx={{
                  padding: 0.5,
                  backgroundColor: isActive("/profile")
                    ? "rgba(255, 122, 26, 0.1)"
                    : "transparent",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(255, 122, 26, 0.1)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Avatar
                  src={userAvatar || "/profile-picture.png"}
                  alt="User Profile"
                  sx={{
                    width: { xs: 32, md: 36 },
                    height: { xs: 32, md: 36 },
                    border: isActive("/profile")
                      ? "2px solid #FF7A1A"
                      : "2px solid transparent",
                    transition: "all 0.3s ease",
                  }}
                />
              </IconButton>
            </Tooltip>
            <Tooltip title="Logout" arrow placement="bottom">
              <IconButton
                onClick={handleLogoutClick}
                sx={{
                  color: "#444444",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: "#EF4444",
                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Logout sx={{ fontSize: { xs: "24px", md: "28px" } }} />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Mobile Menu - Notification & Hamburger */}
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              gap: 1,
              alignItems: "center",
            }}
          >
            {/* Notification Dropdown for Mobile */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                "& > div": {
                  display: "flex",
                  alignItems: "center",
                },
              }}
            >
              <NotificationDropdown />
            </Box>

            {/* Hamburger Menu Button */}
            <IconButton
              onClick={toggleMobileMenu}
              sx={{
                color: "#444444",
                "&:hover": {
                  color: "#FF7A1A",
                  backgroundColor: "rgba(255, 122, 26, 0.1)",
                },
              }}
            >
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer Menu */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: 280,
            background: "linear-gradient(180deg, #fff 0%, #FFF5E6 100%)",
            pt: 2,
          },
        }}
      >
        <Box sx={{ px: 3, py: 2, textAlign: "center" }}>
          <Typography
            variant="h5"
            sx={{
              background: "linear-gradient(135deg, #FF7A1A 0%, #FFB347 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontWeight: "800",
            }}
          >
            ✍️ Tripverse
          </Typography>
        </Box>

        <Divider />

        <List sx={{ pt: 2 }}>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              sx={{
                py: 2,
                px: 3,
                backgroundColor: isActive(item.path)
                  ? "rgba(255, 122, 26, 0.1)"
                  : "transparent",
                borderLeft: isActive(item.path)
                  ? "4px solid #FF7A1A"
                  : "4px solid transparent",
                "&:hover": {
                  backgroundColor: "rgba(255, 122, 26, 0.15)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive(item.path) ? "#FF7A1A" : "#444444",
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  "& .MuiListItemText-primary": {
                    color: isActive(item.path) ? "#FF7A1A" : "#444444",
                    fontWeight: isActive(item.path) ? 600 : 400,
                  },
                }}
              />
            </ListItem>
          ))}

          <Divider sx={{ my: 2 }} />

          <ListItem
            button
            onClick={handleLogoutClick}
            sx={{
              py: 2,
              px: 3,
              "&:hover": {
                backgroundColor: "rgba(239, 68, 68, 0.1)",
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: "#EF4444",
                minWidth: 40,
              }}
            >
              <Logout />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              sx={{
                "& .MuiListItemText-primary": {
                  color: "#EF4444",
                  fontWeight: 500,
                },
              }}
            />
          </ListItem>
        </List>
      </Drawer>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
        PaperProps={{
          sx: {
            borderRadius: 3,
            padding: 2,
            minWidth: { xs: "90%", sm: 400 },
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "1.5rem",
            fontWeight: 600,
            color: "#111",
            pb: 1,
          }}
        >
          Confirm Logout
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
              fontSize: "1rem",
              color: "#555",
              mb: 2,
            }}
          >
            Are you sure you want to logout? You will need to login again to
            access your account.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleLogoutCancel}
            sx={{
              color: "#666",
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 500,
              px: 3,
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.05)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleLogoutConfirm}
            variant="contained"
            sx={{
              backgroundColor: "#EF4444",
              color: "#fff",
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 600,
              px: 3,
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#DC2626",
                boxShadow: "none",
              },
            }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;
