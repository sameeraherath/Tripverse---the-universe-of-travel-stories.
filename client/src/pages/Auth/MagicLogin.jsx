import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";

const MagicLogin = ({ onLoginSuccess }) => {
  const { token } = useParams();
  const navigate = useNavigate();
  const hasRun = useRef(false); // Prevents double execution in strict mode

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        alert("Invalid login link.");
        navigate("/");
        return;
      }

      try {
        console.log("Verifying token:", token);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/magic-login/${token}`,
          {
            method: "POST",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to verify token");
        }

        const data = await response.json();
        console.log("Server Response:", data);

        if (data.token) {
          localStorage.setItem("authToken", data.token);
          alert("Login successful");
          onLoginSuccess();
          navigate("/home");
        } else {
          alert(data.message || "Invalid token");
          navigate("/");
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        console.error(error);
        alert("Something went wrong, please try again.");
        navigate("/");
      }
    };

    if (!hasRun.current) {
      hasRun.current = true;
      verifyToken();
    }
  }, [token, onLoginSuccess, navigate]);

  return <div>Verifying Magic Link...</div>;
};

MagicLogin.propTypes = {
  onLoginSuccess: PropTypes.func.isRequired,
};

export default MagicLogin;
