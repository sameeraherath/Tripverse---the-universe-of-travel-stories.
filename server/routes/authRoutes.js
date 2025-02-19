const express = require("express");
const {
  sendMagicLink,
  verifyMagicLink,
} = require("../controllers/authController");

const router = express.Router();

// Route to send magic link to the user

router.post("/send-magic-link", sendMagicLink);

// Route to verify the magic link token
router.get("/magic-login/:token", verifyMagicLink);

module.exports = router;
