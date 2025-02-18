const dotenv = require("dotenv");

dotenv.config();

const cloudinary = require("cloudinary").v2;

cloudinary.config({});
console.log("Cloudinary URL:", process.env.CLOUDINARY_URL); // Check if it's correctly loaded

module.exports = cloudinary;
