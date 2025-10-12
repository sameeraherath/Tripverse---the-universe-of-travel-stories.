const faqData = [
  {
    id: 1,
    question: "How do I create a post?",
    answer: "To create a post, click the '+' button in the navigation bar or go to the 'Create Post' page. Fill in the title, content, add tags, and optionally upload images. Click 'Publish' when you're ready to share your post with the community.",
    category: "posts",
    keywords: ["create", "post", "publish", "write", "new"]
  },
  {
    id: 2,
    question: "How do I edit my profile?",
    answer: "To edit your profile, click on your profile picture in the navigation bar and select 'Edit Profile'. You can update your display name, bio, profile picture, and other personal information. Don't forget to save your changes!",
    category: "profile",
    keywords: ["edit", "profile", "update", "settings", "personal"]
  },
  {
    id: 3,
    question: "How do bookmarks work?",
    answer: "Bookmarks allow you to save posts for later reading. Click the bookmark icon on any post to save it. You can view all your bookmarked posts in the 'Bookmarks' section of your profile. This helps you keep track of interesting content you want to revisit.",
    category: "bookmarks",
    keywords: ["bookmark", "save", "favorite", "later", "reading"]
  },
  {
    id: 4,
    question: "How do I comment on posts?",
    answer: "To comment on a post, scroll down to the comments section at the bottom of any post. Type your comment in the text box and click 'Post Comment'. You can also reply to other users' comments to start conversations.",
    category: "comments",
    keywords: ["comment", "reply", "discussion", "conversation", "feedback"]
  },
  {
    id: 5,
    question: "How do tags work?",
    answer: "Tags help categorize and discover content. When creating a post, add relevant tags separated by commas. Users can click on tags to find related posts. Popular tags appear in the tag cloud, making it easier to explore trending topics.",
    category: "tags",
    keywords: ["tags", "categories", "discover", "trending", "topics"]
  },
  {
    id: 6,
    question: "How do I manage notifications?",
    answer: "Notifications keep you updated on activity related to your posts and interactions. You can view notifications by clicking the bell icon in the navigation bar. Adjust your notification preferences in your profile settings to control what notifications you receive.",
    category: "notifications",
    keywords: ["notifications", "alerts", "updates", "settings", "preferences"]
  },
  {
    id: 7,
    question: "How do I follow other users?",
    answer: "To follow a user, visit their profile page and click the 'Follow' button. You'll see their posts in your feed and receive notifications about their activity. You can unfollow at any time by clicking the 'Unfollow' button on their profile.",
    category: "following",
    keywords: ["follow", "unfollow", "users", "feed", "connections"]
  },
  {
    id: 8,
    question: "How do I search for posts?",
    answer: "Use the search bar at the top of the page to find posts by title, content, or tags. You can also browse posts by category or use the tag cloud to discover content by topic. Advanced search options help you find exactly what you're looking for.",
    category: "search",
    keywords: ["search", "find", "discover", "browse", "explore"]
  },
  {
    id: 9,
    question: "How do I delete my account?",
    answer: "To delete your account, go to your profile settings and look for the 'Account Settings' section. There you'll find an option to delete your account. Please note that this action is irreversible and will remove all your posts, comments, and data.",
    category: "account",
    keywords: ["delete", "account", "remove", "permanent", "settings"]
  },
  {
    id: 10,
    question: "How do I report inappropriate content?",
    answer: "If you encounter inappropriate content, click the 'Report' button on the post or comment. Our moderation team will review the report and take appropriate action. You can also block users who are causing issues.",
    category: "moderation",
    keywords: ["report", "inappropriate", "moderation", "block", "abuse"]
  }
];

// Get all FAQ items
const getAllFAQs = (req, res) => {
  try {
    res.json({
      success: true,
      data: faqData,
      total: faqData.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching FAQ data",
      error: error.message
    });
  }
};

// Get FAQ by ID
const getFAQById = (req, res) => {
  try {
    const { id } = req.params;
    const faq = faqData.find(item => item.id === parseInt(id));
    
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found"
      });
    }
    
    res.json({
      success: true,
      data: faq
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching FAQ",
      error: error.message
    });
  }
};

// Search FAQs by query
const searchFAQs = (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.json({
        success: true,
        data: faqData,
        total: faqData.length
      });
    }
    
    const query = q.toLowerCase();
    const results = faqData.filter(faq => 
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query) ||
      faq.keywords.some(keyword => keyword.toLowerCase().includes(query))
    );
    
    res.json({
      success: true,
      data: results,
      total: results.length,
      query: q
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error searching FAQs",
      error: error.message
    });
  }
};

// Get FAQs by category
const getFAQsByCategory = (req, res) => {
  try {
    const { category } = req.params;
    const results = faqData.filter(faq => faq.category === category);
    
    res.json({
      success: true,
      data: results,
      total: results.length,
      category: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching FAQs by category",
      error: error.message
    });
  }
};

// Get FAQ categories
const getFAQCategories = (req, res) => {
  try {
    const categories = [...new Set(faqData.map(faq => faq.category))];
    
    res.json({
      success: true,
      data: categories,
      total: categories.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching FAQ categories",
      error: error.message
    });
  }
};

// Process chatbot query (simple keyword matching)
const processChatbotQuery = (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Query is required"
      });
    }
    
    const userQuery = query.toLowerCase();
    let bestMatch = null;
    let maxScore = 0;
    
    // Simple scoring algorithm based on keyword matches
    faqData.forEach(faq => {
      let score = 0;
      
      // Check question match
      if (faq.question.toLowerCase().includes(userQuery)) {
        score += 3;
      }
      
      // Check keyword matches
      faq.keywords.forEach(keyword => {
        if (userQuery.includes(keyword.toLowerCase())) {
          score += 2;
        }
        if (keyword.toLowerCase().includes(userQuery)) {
          score += 1;
        }
      });
      
      // Check answer match
      if (faq.answer.toLowerCase().includes(userQuery)) {
        score += 1;
      }
      
      if (score > maxScore) {
        maxScore = score;
        bestMatch = faq;
      }
    });
    
    if (bestMatch && maxScore > 0) {
      res.json({
        success: true,
        data: {
          answer: bestMatch.answer,
          question: bestMatch.question,
          category: bestMatch.category,
          confidence: Math.min(maxScore / 5, 1) // Normalize confidence score
        }
      });
    } else {
      // Default response for unmatched queries
      res.json({
        success: true,
        data: {
          answer: "I'm sorry, I couldn't find a specific answer to your question. Please try rephrasing your question or browse through our FAQ categories for more help. You can also contact our support team for assistance.",
          question: query,
          category: "general",
          confidence: 0
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error processing chatbot query",
      error: error.message
    });
  }
};

module.exports = {
  getAllFAQs,
  getFAQById,
  searchFAQs,
  getFAQsByCategory,
  getFAQCategories,
  processChatbotQuery
};
