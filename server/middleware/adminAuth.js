const jwt = require("jsonwebtoken");
const User = require("../models/user");

const adminAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: "Invalid token." });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: "Account is deactivated." });
    }

    if (!['admin', 'superadmin'].includes(user.role)) {
      return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Admin auth error:", error);
    res.status(401).json({ message: "Invalid token." });
  }
};

const superAdminAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: "Invalid token." });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: "Account is deactivated." });
    }

    if (user.role !== 'superadmin') {
      return res.status(403).json({ message: "Access denied. Super admin privileges required." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Super admin auth error:", error);
    res.status(401).json({ message: "Invalid token." });
  }
};

module.exports = { adminAuth, superAdminAuth };
