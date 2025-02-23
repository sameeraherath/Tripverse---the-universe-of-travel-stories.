const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const connectDb = require("./config/db");
const postRoutes = require("./routes/postRoutes");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const profileRoutes = require("./routes/profileRoutes");

dotenv.config();
connectDb();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5174",
      "http://localhost:5173",
      "https://blogger-client-murex.vercel.app",
      "https://blogger-client-sameeraheraths-projects.vercel.app",
      "https://blogger-client-git-main-sameeraheraths-projects.vercel.app",
      "https://blogger-client-6wrbdejho-sameeraheraths-projects.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static("uploads"));

app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
