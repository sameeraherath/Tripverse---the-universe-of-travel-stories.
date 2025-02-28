const express = require("express");
const router = express.Router();
const { generateContent } = require("../controllers/aiController");
const authMiddleware = require("../middleware/authMiddleware");

// Protected routes requiring authentication
router.post("/generate", authMiddleware, generateContent);

module.exports = router;
