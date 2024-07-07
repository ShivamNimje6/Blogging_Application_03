const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const cookieParser = require("cookie-parser");

const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const commentRoute = require("./routes/comments");

// Load environment variables
dotenv.config();

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database is connected successfully!");
  } catch (err) {
    console.log(err);
  }
};

// CORS configuration
const corsOptions = {
  origin: [
    "*",
    "http://localhost:5173", // Local development URL
    "https://blogging-application-p21kj2ik7-shivam-nimjes-projects.vercel.app", // Production frontend URL
  ],
  credentials: true,
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "/images")));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/comments", commentRoute);

// Image upload
const storage = multer.diskStorage({
  destination: (req, file, fn) => {
    fn(null, "images");
  },
  filename: (req, file, fn) => {
    fn(null, req.body.img);
  },
});
const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("Image has been uploaded successfully!");
});

// Start the server
app.listen(process.env.PORT || 5000, () => {
  connectDB();
  console.log(`App is running on port ${process.env.PORT || 5000}`);
});
