import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleChat}
          className="bg-gradient-primary text-white rounded-full p-4 shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-primary/30"
          aria-label="Toggle FAQ Chatbot"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Chatbot FAQ Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-lg shadow-2xl overflow-hidden animate-slideUp">
          {/* Header */}
          <div className="bg-gradient-primary text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <h3 className="font-semibold">FAQ Chatbot</h3>
            </div>
            <button
              onClick={toggleChat}
              className="hover:bg-black/10 rounded-full p-1 transition-colors"
              aria-label="Close chatbot"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Content */}
          <div className="h-96 overflow-y-auto p-4 bg-gray-50">
            {/* Welcome Message */}
            <div className="mb-4">
              <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                <p className="text-gray-dark text-sm">
                  👋 Hello! I&apos;m your FAQ assistant. How can I help you
                  today?
                </p>
              </div>
            </div>

            {/* FAQ Options */}
            <div className="space-y-2">
              <button className="w-full text-left bg-white hover:bg-orange-50 rounded-lg p-3 shadow-sm border border-gray-200 transition-colors">
                <span className="text-sm font-medium text-gray-dark">
                  📝 How do I create a post?
                </span>
              </button>
              <button className="w-full text-left bg-white hover:bg-orange-50 rounded-lg p-3 shadow-sm border border-gray-200 transition-colors">
                <span className="text-sm font-medium text-gray-dark">
                  👤 How do I edit my profile?
                </span>
              </button>
              <button className="w-full text-left bg-white hover:bg-orange-50 rounded-lg p-3 shadow-sm border border-gray-200 transition-colors">
                <span className="text-sm font-medium text-gray-dark">
                  🔖 How do bookmarks work?
                </span>
              </button>
              <button className="w-full text-left bg-white hover:bg-orange-50 rounded-lg p-3 shadow-sm border border-gray-200 transition-colors">
                <span className="text-sm font-medium text-gray-dark">
                  💬 How do I comment on posts?
                </span>
              </button>
              <button className="w-full text-left bg-white hover:bg-orange-50 rounded-lg p-3 shadow-sm border border-gray-200 transition-colors">
                <span className="text-sm font-medium text-gray-dark">
                  🏷️ How do tags work?
                </span>
              </button>
              <button className="w-full text-left bg-white hover:bg-orange-50 rounded-lg p-3 shadow-sm border border-gray-200 transition-colors">
                <span className="text-sm font-medium text-gray-dark">
                  🔔 How do I manage notifications?
                </span>
              </button>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your question..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
              <button className="bg-gradient-primary text-white rounded-full px-4 py-2 text-sm font-medium transition-all hover:scale-105">
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingActionButton;
