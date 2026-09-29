const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createPost,
    getAllPosts,
    getPostById,
    getMyPosts,
    updatePost,
    deletePost
} = require("../controllers/postController");


// All post APIs require authentication

// Create post
router.post(
    "/",
    authMiddleware,
    createPost
);


// Get all posts
router.get(
    "/",
    authMiddleware,
    getAllPosts
);


// Get my posts
router.get(
    "/my",
    authMiddleware,
    getMyPosts
);


// Get single post
router.get(
    "/:id",
    authMiddleware,
    getPostById
);


// Update post
router.put(
    "/:id",
    authMiddleware,
    updatePost
);


// Delete post
router.delete(
    "/:id",
    authMiddleware,
    deletePost
);


module.exports = router;