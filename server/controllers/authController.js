const User = require("../models/user");
const Profile = require("../models/profile");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendMagicLink = async (req, res) => {
  const { email } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user
      user = new User({ email });
      await user.save();

      // Create a profile for the new user
      const profile = new Profile({ user: user._id });
      await profile.save();
    }

    // Generate a magic link token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    user.magicLinkToken = token;
    user.magicLinkTokenExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    // Send the magic link email
    const magicLink = `${process.env.FRONTEND_URL}/magic-login/${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Magic Link for Login",
      text: `Click here to log in: ${magicLink}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Magic link sent!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending magic link" });
  }
};

const verifyMagicLink = async (req, res) => {
  const { token } = req.params;

  try {
    // Find the user with the token
    const user = await User.findOne({
      magicLinkToken: token,
      magicLinkTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Clear the magic link token
    user.magicLinkToken = null;
    user.magicLinkTokenExpires = null;
    await user.save();

    // Check if the user has a profile
    let profile = await Profile.findOne({ user: user._id });

    if (!profile) {
      // Create a profile for the user if it doesn't exist
      profile = new Profile({ user: user._id });
      await profile.save();
    }

    // Generate a JWT token for authentication
    const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token: authToken });
  } catch (error) {
    console.error("Error verifying magic link:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { sendMagicLink, verifyMagicLink };
