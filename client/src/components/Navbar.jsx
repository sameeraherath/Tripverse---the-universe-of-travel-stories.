import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import { Create, Logout, AccountCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/authService";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        background: "#ffffff",
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {" "}
        <Typography
          variant="h4"
          component="button"
          onClick={() => navigate("/home")}
          sx={{
            background: "linear-gradient(to right, #FF7A1A, #FFB347)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontWeight: "bold",
            border: "none",
            cursor: "pointer",
            fontSize: "2rem",
            letterSpacing: "0.5px",
            "&:hover": {
              opacity: 0.9,
            },
          }}
        >
          Blogger
        </Typography>
        <div>
          {" "}
          <IconButton
            onClick={() => navigate("/create")}
            sx={{
              color: "#444444",
              "&:hover": {
                color: "#111111",
              },
            }}
          >
            <Create />
          </IconButton>
          <IconButton
            onClick={handleLogout}
            sx={{
              color: "#444444",
              "&:hover": {
                color: "#111111",
              },
            }}
          >
            <Logout />
          </IconButton>
          <IconButton
            onClick={() => navigate("/profile")}
            sx={{
              color: "#444444",
              "&:hover": {
                color: "#111111",
              },
            }}
          >
            <AccountCircle />
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
