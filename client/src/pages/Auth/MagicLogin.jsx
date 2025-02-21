import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { Slide, ToastContainer, toast } from "react-toastify";

const MagicLogin = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const hasRun = useRef(false);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        toast.error("Invalid token");
        setTimeout(() => navigate("/"), 2000);
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
          toast.success("Login successful");
          setTimeout(() => navigate("/home"), 2000);
        } else {
          toast.error("Invalid token");
          setTimeout(() => navigate("/"), 2000);
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        console.error(error);
        toast.error("Error verifying token");
        setTimeout(() => navigate("/"), 2000);
      }
    };

    if (!hasRun.current) {
      hasRun.current = true;
      verifyToken();
    }
  }, [token, navigate]);

  return (
    <>
      <div>Verifying Magic Link...</div>;
      <ToastContainer
        position="bottom-center"
        hideProgressBar={true}
        theme="dark"
        transition={Slide}
      />
    </>
  );
};

export default MagicLogin;
