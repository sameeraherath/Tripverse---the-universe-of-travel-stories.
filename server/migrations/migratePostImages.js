const mongoose = require("mongoose");
const Post = require("../models/post");
require("dotenv").config();

const migratePostImages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Find all posts that have the old 'image' field but not 'images' field
    const posts = await Post.find({ image: { $exists: true } });

    console.log(`Found ${posts.length} posts with old image field`);

    let migratedCount = 0;

    for (const post of posts) {
      // If post has an image and doesn't have images array, migrate it
      if (post.image && (!post.images || post.images.length === 0)) {
        post.images = [post.image];
        await post.save();
        migratedCount++;
        console.log(`Migrated post ${post._id}`);
      }
    }

    console.log(`Successfully migrated ${migratedCount} posts`);
    process.exit(0);
  } catch (error) {
    console.error("Migration error:", error);
    process.exit(1);
  }
};

migratePostImages();
