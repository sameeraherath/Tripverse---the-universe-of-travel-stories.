const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");
const Profile = require("../models/profile");

// Dashboard Statistics
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalPosts,
      totalComments,
      recentUsers,
      recentPosts,
      topPosts,
      userStatsByMonth,
      postStatsByMonth
    ] = await Promise.all([
      User.countDocuments({ isActive: true }),
      Post.countDocuments(),
      Comment.countDocuments(),
      User.find({ isActive: true })
        .populate('profile', 'username avatar')
        .sort({ createdAt: -1 })
        .limit(5),
      Post.find()
        .populate('author', 'email')
        .sort({ createdAt: -1 })
        .limit(5),
      Post.find()
        .populate('author', 'email')
        .sort({ likeCount: -1 })
        .limit(5),
      getUserStatsByMonth(),
      getPostStatsByMonth()
    ]);

    // Calculate growth percentages
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    const [
      lastMonthUsers,
      lastMonthPosts
    ] = await Promise.all([
      User.countDocuments({ 
        isActive: true, 
        createdAt: { $lt: lastMonth } 
      }),
      Post.countDocuments({ 
        createdAt: { $lt: lastMonth } 
      })
    ]);

    const userGrowthPercentage = lastMonthUsers > 0 
      ? ((totalUsers - lastMonthUsers) / lastMonthUsers * 100).toFixed(1)
      : 0;
    
    const postGrowthPercentage = lastMonthPosts > 0 
      ? ((totalPosts - lastMonthPosts) / lastMonthPosts * 100).toFixed(1)
      : 0;

    res.json({
      stats: {
        totalUsers,
        totalPosts,
        totalComments,
        userGrowthPercentage: parseFloat(userGrowthPercentage),
        postGrowthPercentage: parseFloat(postGrowthPercentage)
      },
      recentUsers,
      recentPosts,
      topPosts,
      charts: {
        userStatsByMonth,
        postStatsByMonth
      }
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Error fetching dashboard statistics" });
  }
};

// Helper function to get user stats by month
const getUserStatsByMonth = async () => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const stats = await User.aggregate([
    {
      $match: {
        isActive: true,
        createdAt: { $gte: sixMonthsAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 }
    }
  ]);

  return stats.map(stat => ({
    month: `${stat._id.year}-${stat._id.month.toString().padStart(2, '0')}`,
    count: stat.count
  }));
};

// Helper function to get post stats by month
const getPostStatsByMonth = async () => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const stats = await Post.aggregate([
    {
      $match: {
        createdAt: { $gte: sixMonthsAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 }
    }
  ]);

  return stats.map(stat => ({
    month: `${stat._id.year}-${stat._id.month.toString().padStart(2, '0')}`,
    count: stat.count
  }));
};

// User Management
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', role = '', isActive } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) {
      query.role = role;
    }
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .populate('profile', 'username avatar')
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(query)
    ]);

    res.json({
      users,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, isActive } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent superadmin from changing their own role
    if (user._id.toString() === req.user._id.toString() && role !== 'superadmin') {
      return res.status(400).json({ message: "Cannot change your own role" });
    }

    const updateData = {};
    if (role) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true })
      .populate('profile', 'username avatar')
      .select('-password');

    res.json(updatedUser);
  } catch (error) {
    console.error("Update user role error:", error);
    res.status(500).json({ message: "Error updating user role" });
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  updateUserRole
};
