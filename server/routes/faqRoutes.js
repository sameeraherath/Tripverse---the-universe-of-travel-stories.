const express = require("express");
const router = express.Router();
const {
  getAllFAQs,
  getFAQById,
  searchFAQs,
  getFAQsByCategory,
  getFAQCategories,
  processChatbotQuery
} = require("../controllers/faqController");

// Get all FAQs
router.get("/", getAllFAQs);

// Get FAQ by ID
router.get("/:id", getFAQById);

// Search FAQs
router.get("/search", searchFAQs);

// Get FAQs by category
router.get("/category/:category", getFAQsByCategory);

// Get FAQ categories
router.get("/categories", getFAQCategories);

// Process chatbot query
router.post("/chatbot", processChatbotQuery);

module.exports = router;
