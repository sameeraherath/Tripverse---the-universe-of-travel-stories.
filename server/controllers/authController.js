const User = require("../models/user");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

// Create a nodemailer transporter to send emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send the magic link to the user

const sendMagicLink = async (req, res) => {
  const { email } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ email });
      await user.save();
    }

    // Generate a random token

    const token = crypto.randomBytes(32).toString("hex");
    const expiryTime = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    // Store the token and expiry in the database
    user.magicLinkToken = token;
    user.magicLinkTokenExpires = expiryTime;
    await user.save();

    console.log("Saved Token in Database:", token);
    console.log("Token Expiry Time:", expiryTime);

    // Generate the magic link URL
    const magicLink = `${process.env.FRONTEND_URL}/magic-login/${token}`;

    // Send the email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your magic link for logging in",
      text: `Click on the link to log in: ${magicLink}`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "Magic link sent!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error sending magic link" });
  }
};

// Verify the magic link token

const verifyMagicLink = async (req, res) => {
  let { token } = req.params;
  token = token.trim();

  console.log("Received Token from Request:", token); // Debugging log

  try {
    // Find the user with the token
    const user = await User.findOne({
      magicLinkToken: token,
      magicLinkTokenExpires: { $gt: new Date() },
    });

    console.log("User Found in Database:", user); // Debugging log

    if (!user) {
      console.log("Invalid or expired token"); // Debugging log
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Clear the magic link token after successful login
    user.magicLinkToken = null;
    user.magicLinkTokenExpiry = null;
    await user.save();

    // Generate a JWT token for authentication
    const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log("Generated Auth Token:", authToken); // Debugging log

    res.json({ message: "Login successful", token: authToken });
  } catch (error) {
    console.error("Error verifying magic link:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { sendMagicLink, verifyMagicLink };
