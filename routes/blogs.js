const express = require("express");
const Blog = require("../models/Blog");
const protect = require("../middleware/auth");

const router = express.Router();


// CREATE BLOG
router.post("/", protect, async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                message: "Title and content are required"
            });
        }

        const blog = new Blog({
            title,
            content,
            author: req.user.id
        });

        await blog.save();

        res.status(201).json({
            message: "Blog created successfully",
            blog
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// GET LOGGED-IN USER'S BLOGS
router.get("/my-blogs", protect, async (req, res) => {
    try {
        const blogs = await Blog.find({
            author: req.user.id
        })
        .populate("author", "name email")
        .sort({ createdAt: -1 });

        res.json(blogs);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// GET SINGLE BLOG
router.get("/:id", async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
            .populate("author", "name email");

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }

        res.json(blog);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


module.exports = router;