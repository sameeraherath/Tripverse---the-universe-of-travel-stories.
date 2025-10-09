import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";

const ChatButton = ({ userId, variant = "default" }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/messages?userId=${userId}`);
  };

  if (variant === "compact") {
    return (
      <button
        onClick={handleClick}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        title="Send message"
      >
        <MessageCircle className="w-5 h-5 text-gray-600" />
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-semibold rounded-full border-2 border-gray-200 hover:border-orange-500 hover:text-orange-500 transform hover:-translate-y-0.5 transition-all duration-300"
    >
      <MessageCircle className="w-5 h-5" />
      <span>Message</span>
    </button>
  );
};

ChatButton.propTypes = {
  userId: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(["default", "compact"]),
};

export default ChatButton;
