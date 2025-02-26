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
    <div className="min-h-screen flex bg-gradient-to-r from-neutral-900 to-neutral-800">
      {/* Left Side - Introduction */}
      <div className="w-2/3 flex-col items-center justify-center hidden md:flex">
        <motion.h1
          className="text-5xl font-extrabold text-center leading-tight px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          Write Better, Faster, Together with Blogger
        </motion.h1>
        <motion.p
          className=" mt-6 text-2xl text-center px-8 opacity-80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          🌟 Join Thousands of Writers. Start Your AI-Powered Blog Today!
        </motion.p>
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center  flex-col px-8 ">
        <h2 className="text-3xl font-bold text-center text-white mb-10">
          Lets Get Started
        </h2>
        <p> </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block font-medium text-white pb-4 px-2"
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
              className="w-full  bg-neutral-800 border border-neutral-600  px-4 py-4 text-white focus:outline-none rounded-3xl"
              required
            />
            <p className="pt-6 px-2 text-gray-300 text-sm">
              Enter your email to receive a magic link for quick access.
            </p>
          </div>
          <div className="mt-6 flex items-center justify-center">
            <button
              type="submit"
              className="bg-stone-800 border border-stone-600 text-white py-4 px-8 font-semibold  rounded-3xl   disabled:cursor-not-allowed "
              disabled={loading}
            >
              {loading ? "Sending Magic Link..." : "Send Magic Link"}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer
        position="bottom-center"
        hideProgressBar={true}
        theme="dark"
        transition={Slide}
      />
    </div>
  );
};

export default LoginPage;
