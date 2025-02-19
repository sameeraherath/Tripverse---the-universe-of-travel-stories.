import { useState } from "react";
import PropTypes from "prop-types";

const LoginPage = ({ onLoginSuccess }) => {
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
        onLoginSuccess();
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
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-md text-white">
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Lets Get Started
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block font-medium text-gray-600">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-2 border-gray-300 rounded-md text-black"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="mt-6 flex items-center justify-between">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-md"
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

LoginPage.propTypes = {
  onLoginSuccess: PropTypes.func,
};

export default LoginPage;
