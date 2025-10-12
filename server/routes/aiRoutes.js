const express = require("express");
const router = express.Router();
const { fixGrammarMistakes } = require("../controllers/aiController");
const authMiddleware = require("../middleware/authMiddleware");

// Protected routes requiring authentication
router.post("/fix-grammar", authMiddleware, fixGrammarMistakes);

module.exports = router;
