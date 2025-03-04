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
      sx={{ background: "linear-gradient(to right, #171717, #1f1f1f)" }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          component="button"
          onClick={() => navigate("/home")}
          sx={{
            color: "white",
            fontWeight: "bold",
            border: "none",
            background: "none",
            cursor: "pointer",
          }}
        >
          Blogger
        </Typography>
        <div>
          <IconButton color="inherit" onClick={() => navigate("/create")}>
            <Create />
          </IconButton>
          <IconButton color="inherit" onClick={handleLogout}>
            <Logout />
          </IconButton>
          <IconButton color="inherit" onClick={() => navigate("/profile")}>
            <AccountCircle />
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
