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
        console.error("No token provided in URL");
        toast.error("Invalid token - No token provided");
        setTimeout(() => navigate("/"), 2000);
        return;
      }

      console.log(
        "Verifying magic link token:",
        token.substring(0, 20) + "..."
      );

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/magic-login/${token}`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        console.log("Server response:", data);

        if (!response.ok) {
          console.error("Server returned error:", response.status, data);
          toast.error(data.message || "Failed to verify token");
          setTimeout(() => navigate("/"), 2000);
          return;
        }

        if (data.token) {
          localStorage.setItem("authToken", data.token);
          console.log("Login successful, token saved");
          toast.success(
            "🎉 Login successful! Redirecting to your dashboard...",
            {
              autoClose: 2000,
              style: {
                background: "#fff",
                color: "#111",
                borderLeft: "4px solid #FF7A1A",
              },
            }
          );
          setTimeout(() => navigate("/home"), 2000);
        } else {
          console.error("No token in response:", data);
          toast.error("Invalid response from server");
          setTimeout(() => navigate("/"), 2000);
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        toast.error(`Error: ${error.message || "Network error"}`);
        setTimeout(() => navigate("/"), 2000);
      }
    };

    if (!hasRun.current) {
      hasRun.current = true;
      verifyToken();
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF9F3]">
      <div className="text-center p-12 bg-white rounded-2xl shadow-xl max-w-md">
        {/* Animated gradient spinner */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-[#FFE5CC] animate-pulse"></div>
          <div className="absolute inset-0 rounded-full border-t-4 border-[#FF7A1A] animate-spin"></div>
        </div>

        {/* Main heading */}
        <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-[#FF7A1A] to-[#FFB347] text-transparent bg-clip-text">
          Verifying Magic Link
        </h2>

        {/* Subtext */}
        <p className="text-[#666] text-lg mb-4">
          Please wait while we securely log you in...
        </p>

        {/* Security indicator */}
        <div className="flex items-center justify-center gap-2 text-sm text-[#888]">
          <svg
            className="w-4 h-4 text-[#FF7A1A]"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
          <span>Secure authentication in progress</span>
        </div>
      </div>
      <ToastContainer
        position="bottom-center"
        hideProgressBar={true}
        theme="light"
        transition={Slide}
      />
    </div>
  );
};

export default MagicLogin;
