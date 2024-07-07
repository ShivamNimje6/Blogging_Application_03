// backend/routes/posts.js

const express = require("express");
const router = express.Router();
const verifyToken = require("../verifyToken");
const Post = require("../models/Post");

const calculateReadingTime = (content) => {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const time = Math.ceil(words / wordsPerMinute);
  return `${time} min read`;
};

// CREATE
router.post("/create", verifyToken, async (req, res) => {
  try {
    const { title, desc, photo, username, userId, categories } = req.body;
    const readingTime = calculateReadingTime(desc);

    const newPost = new Post({
      title,
      desc,
      photo,
      username,
      userId: req.userId, // Use req.userId from verifyToken middleware
      categories,
      readingTime,
    });

    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { title, desc, photo, username, userId, categories } = req.body;
    const readingTime = calculateReadingTime(desc);

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title,
          desc,
          photo,
          username,
          userId: req.userId,
          categories,
          readingTime,
        },
      },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    // Also delete associated comments
    await Comment.deleteMany({ postId: req.params.id });
    res.status(200).json("Post has been deleted!");
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET POST DETAILS
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET POSTS
router.get("/", async (req, res) => {
  const query = req.query;

  try {
    const searchFilter = {
      title: { $regex: query.search, $options: "i" },
    };
    const posts = await Post.find(query.search ? searchFilter : null);
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET USER POSTS
router.get("/user/:userId", async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.userId });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
