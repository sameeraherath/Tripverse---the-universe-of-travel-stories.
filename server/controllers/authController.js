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
      subject: "Your Secure Magic Login Link - Blogger",
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; background-color: #f4f4f4; padding: 30px;">
          <div style="max-width: 500px; background-color: white; padding: 20px; border-radius: 8px; 
                      box-shadow: 0 0 10px rgba(0,0,0,0.1); margin: auto;">
            <h2 style="color: #333;">Welcome to <span style="color: #007bff;">Blogger</span>! 📝</h2>
            <p style="font-size: 16px; color: #555;">We're excited to have you back. Click the button below to securely log in:</p>
            
            <a href="${magicLink}" 
               style="display: inline-block; background-color: #222; color: white; padding: 12px 24px; 
                      text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 5px; margin-top: 10px;">
              🔑 Secure Login to Blogger
            </a>
            
            <p style="font-size: 14px; color: #777; margin-top: 20px;">
              This login link is valid for <strong>1 hour</strong>. If you did not request this, you can safely ignore it.
            </p>
    
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
            
            <p style="font-size: 14px; color: #888;">
              Need help? Contact our support team at 
              <a href="mailto:support@blogger.com" style="color: #007bff; text-decoration: none;">support@blogger.com</a>.
            </p>
    
            <p style="font-size: 14px; color: #888;">
              Thank you for using <strong>Blogger</strong> – Your space to write and share ideas! 🚀
            </p>
          </div>
        </div>
      `,
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
