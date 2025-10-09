const mongoose = require("mongoose");
const User = require("../models/user");
const Profile = require("../models/profile");
require("dotenv").config();

const linkUserProfiles = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Find all users
    const users = await User.find({});
    console.log(`Found ${users.length} users`);

    let updatedCount = 0;
    let createdCount = 0;

    for (const user of users) {
      // Check if user already has a profile reference
      if (user.profile) {
        console.log(`User ${user.email} already has profile linked`);
        continue;
      }

      // Find or create profile for this user
      let profile = await Profile.findOne({ user: user._id });

      if (!profile) {
        // Create profile if it doesn't exist
        profile = new Profile({ user: user._id });
        await profile.save();
        console.log(`Created profile for user ${user.email}`);
        createdCount++;
      }

      // Link profile to user
      user.profile = profile._id;
      await user.save({ validateBeforeSave: false });
      console.log(`Linked profile to user ${user.email}`);
      updatedCount++;
    }

    console.log(`\nMigration completed!`);
    console.log(`Profiles created: ${createdCount}`);
    console.log(`Users updated: ${updatedCount}`);

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Migration error:", error);
    process.exit(1);
  }
};

linkUserProfiles();
