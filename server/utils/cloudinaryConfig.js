const dotenv = require("dotenv");

dotenv.config();

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dxugdxrqx",
  api_key: "681498867918831", // Your API key
  api_secret: "f6eDjwImqYHPSfprI93HS7B3R4I", // Your API secret
});
console.log("Cloudinary URL:", process.env.CLOUDINARY_URL); // Check if it's correctly loaded

module.exports = cloudinary;
