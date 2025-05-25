import { useState } from "react";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import { Slide, ToastContainer, toast } from "react-toastify";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Check if the email is valid (simple validation)
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
      toast.error("Invalid email address");
      setLoading(false);
      return;
    }

    try {
      // API call to send magic link

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/send-magic-link`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        toast.success("Magic link sent successfully");
      } else {
        const data = await response.json();

        toast.error(data.message || "Something went wrong, please try again");
      }
    } catch (error) {
      toast.error("Something went wrong, please try again");
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-[#FFF9F3]">
      {/* Left Side - Introduction */}
      <div className="w-2/3 flex-col items-center justify-center hidden md:flex space-y-8">
        <div className="max-w-2xl mx-auto">
          <motion.h1
            className="text-6xl font-extrabold text-center leading-tight px-4 bg-gradient-to-r from-[#FF7A1A] to-[#FFB347] text-transparent bg-clip-text"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Write Better, Faster, Together with Blogger
          </motion.h1>
          <motion.p
            className="mt-8 text-2xl text-center px-8 text-[#444]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            🌟 Join Thousands of Writers. Start Your AI-Powered Blog Today!
          </motion.p>

          <motion.div
            className="mt-12 flex justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="text-center p-4 bg-white border border-[#F3F4F6] rounded-lg shadow-sm">
              <h3 className="text-2xl font-bold text-[#111]">10K+</h3>
              <p className="text-[#555]">Active Writers</p>
            </div>
            <div className="text-center p-4 bg-white border border-[#F3F4F6] rounded-lg shadow-sm">
              <h3 className="text-2xl font-bold text-[#111]">50K+</h3>
              <p className="text-[#555]">Articles Published</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center flex-col px-8 bg-white">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold text-center text-[#111] mb-8">
            Let&#39;s Get Started
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <label
                htmlFor="email"
                className="block font-medium text-[#444] text-lg"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FFF9F3] border border-[#F3F4F6] px-4 py-4 text-[#111] focus:outline-none focus:ring-2 focus:ring-[#FF7A1A]/20 rounded-xl transition-all"
                required
              />
              <p className="text-[#555] text-sm">
                Enter your email to receive a magic link for quick access.
              </p>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#FF7A1A] to-[#FFB347] hover:from-[#FF6600] hover:to-[#FFA533] text-white py-4 px-8 font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Sending Magic Link..." : "Send Magic Link"}
            </button>
          </form>
        </motion.div>
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

export default LoginPage;
