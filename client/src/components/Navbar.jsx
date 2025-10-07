import { AppBar, Toolbar, Typography, IconButton, Tooltip, Box } from "@mui/material";
import { Create, Logout, AccountCircle, Home } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../utils/authService";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/");
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar
      position="fixed"
      sx={{
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 2px 20px rgba(0, 0, 0, 0.08)",
        borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", py: 1 }}>
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
          ✍️ Blogger
        </Typography>
        <Box sx={{ display: "flex", gap: { xs: 0.5, md: 1 }, alignItems: "center" }}>
          <Tooltip title="Home" arrow placement="bottom">
            <IconButton
              onClick={() => navigate("/home")}
              sx={{
                color: isActive("/home") ? "#FF7A1A" : "#444444",
                backgroundColor: isActive("/home") ? "rgba(255, 122, 26, 0.1)" : "transparent",
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
                backgroundColor: isActive("/create") ? "rgba(255, 122, 26, 0.1)" : "transparent",
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
          <Tooltip title="Profile" arrow placement="bottom">
            <IconButton
              onClick={() => navigate("/profile")}
              sx={{
                color: isActive("/profile") ? "#FF7A1A" : "#444444",
                backgroundColor: isActive("/profile") ? "rgba(255, 122, 26, 0.1)" : "transparent",
                transition: "all 0.3s ease",
                "&:hover": {
                  color: "#FF7A1A",
                  backgroundColor: "rgba(255, 122, 26, 0.1)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <AccountCircle sx={{ fontSize: { xs: "24px", md: "28px" } }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Logout" arrow placement="bottom">
            <IconButton
              onClick={handleLogout}
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
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
