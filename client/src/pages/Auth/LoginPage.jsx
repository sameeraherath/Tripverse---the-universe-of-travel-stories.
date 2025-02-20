import { useState } from "react";
import { motion } from "framer-motion";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Check if the email is valid (simple validation)
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
      setError("Invalid email address");
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
        alert("Magic link sent to your email");
      } else {
        const data = await response.json();
        setError(data.message || "Something went wrong, please try again");
      }
    } catch (error) {
      setError("Something went wrong, please try again", error);
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Introduction */}
      <div className="w-3/4 bg-gradient-to-r from-blue-500 to-indigo-700  flex-col items-center justify-center hidden md:flex">
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
      <div className="w-full md:w-1/2 flex items-center justify-center  flex-col">
        <h2 className="text-3xl font-bold text-center text-white mb-10">
          Lets Get Started
        </h2>
        <p> </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block font-medium text-white pb-2 px-2"
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
              className=" px-4 py-2 mt-2  rounded-3xl border border-gray-400  focus:outline-none text-white w-96 h-12"
              required
            />
            <p className="pt-6 px-2 text-gray-300 text-sm">
              Magic link will be sent to given email address.
            </p>
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="mt-6 flex items-center justify-between">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-indigo-700 rounded-3xl "
              disabled={loading}
            >
              {loading ? "Sending Magic Link..." : "Send Magic Link"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
