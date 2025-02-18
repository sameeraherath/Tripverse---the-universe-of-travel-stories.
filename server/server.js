const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const conncetDb = require("./config/db");
const postRoutes = require("./routes/postRoutes");
const multer = require("multer");
const path = require("path");

dotenv.config();
conncetDb();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "blogger-client-sameeraheraths-projects.vercel.app",
    ],
  })
);
app.use(express.json());

app.use("/uploads", express.static("uploads"));
app.use("/api/posts", postRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
