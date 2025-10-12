import { useState, useEffect } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import api from "../utils/api";

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFaqs, setIsLoadingFaqs] = useState(false);

  // Load FAQs on component mount
  useEffect(() => {
    if (isOpen) {
      loadFAQs();
    }
  }, [isOpen]);

  const loadFAQs = async () => {
    setIsLoadingFaqs(true);
    try {
      const response = await api.get("/api/faq");
      if (response.data.success) {
        setFaqs(response.data.data);
        // Add welcome message
        setMessages([
          {
            id: 1,
            type: "bot",
            content: "👋 Hello! I'm your FAQ assistant. How can I help you today?",
            timestamp: new Date()
          }
        ]);
      }
    } catch (error) {
      console.error("Error loading FAQs:", error);
      setMessages([
        {
          id: 1,
          type: "bot",
          content: "👋 Hello! I'm your FAQ assistant. How can I help you today?",
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoadingFaqs(false);
    }
  };

  const handleFAQClick = async (faq) => {
    const userMessage = {
      id: Date.now(),
      type: "user",
      content: faq.question,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await api.post("/api/faq/chatbot", {
        query: faq.question
      });
      
      if (response.data.success) {
        const botMessage = {
          id: Date.now() + 1,
          type: "bot",
          content: response.data.data.answer,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error("Error processing FAQ:", error);
      const errorMessage = {
        id: Date.now() + 1,
        type: "bot",
        content: "Sorry, I encountered an error processing your question. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await api.post("/api/faq/chatbot", {
        query: inputValue
      });
      
      if (response.data.success) {
        const botMessage = {
          id: Date.now() + 1,
          type: "bot",
          content: response.data.data.answer,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error("Error processing query:", error);
      const errorMessage = {
        id: Date.now() + 1,
        type: "bot",
        content: "Sorry, I encountered an error processing your question. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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
            {isLoadingFaqs ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                <span className="ml-2 text-gray-600">Loading FAQs...</span>
              </div>
            ) : (
              <>
                {/* Messages */}
                <div className="space-y-3 mb-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 shadow-sm border ${
                          message.type === "user"
                            ? "bg-orange-500 text-white"
                            : "bg-white text-gray-dark border-gray-200"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  
                  {/* Loading indicator */}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                        <div className="flex items-center">
                          <Loader2 className="w-4 h-4 animate-spin text-orange-500 mr-2" />
                          <span className="text-sm text-gray-600">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* FAQ Options - only show if no messages or just welcome message */}
                {messages.length <= 1 && (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
                    {faqs.slice(0, 6).map((faq) => (
                      <button
                        key={faq.id}
                        onClick={() => handleFAQClick(faq)}
                        className="w-full text-left bg-white hover:bg-orange-50 rounded-lg p-3 shadow-sm border border-gray-200 transition-colors"
                      >
                        <span className="text-sm font-medium text-gray-dark">
                          {faq.question}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your question..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary text-sm disabled:opacity-50"
              />
              <button 
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="bg-gradient-primary text-white rounded-full px-4 py-2 text-sm font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingActionButton;
