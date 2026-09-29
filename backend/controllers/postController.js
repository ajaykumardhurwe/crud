const db = require("../config/db");


// ========================================
// CREATE POST
// ========================================
exports.createPost = async (req, res) => {
    try {

        const userId = req.user.id;

        const {
            title,
            content,
            image_url
        } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required"
            });
        }

        const [result] = await db.execute(
            `INSERT INTO posts
            (user_id, title, content, image_url)
            VALUES (?, ?, ?, ?)`,
            [
                userId,
                title,
                content,
                image_url || null
            ]
        );

        const [posts] = await db.execute(
            `SELECT
                p.id,
                p.user_id,
                u.name AS user_name,
                p.title,
                p.content,
                p.image_url,
                p.created_at,
                p.updated_at
             FROM posts p
             INNER JOIN users u
                ON p.user_id = u.id
             WHERE p.id = ?`,
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: "Post created successfully",
            post: posts[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ========================================
// GET ALL POSTS
// ========================================
exports.getAllPosts = async (req, res) => {
    try {

        const [posts] = await db.execute(
            `SELECT
                p.id,
                p.user_id,
                u.name AS user_name,
                u.email AS user_email,
                p.title,
                p.content,
                p.image_url,
                p.created_at,
                p.updated_at
             FROM posts p
             INNER JOIN users u
                ON p.user_id = u.id
             ORDER BY p.created_at DESC`
        );

        res.json({
            success: true,
            count: posts.length,
            posts
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ========================================
// GET SINGLE POST
// ========================================
exports.getPostById = async (req, res) => {
    try {

        const { id } = req.params;

        const [posts] = await db.execute(
            `SELECT
                p.id,
                p.user_id,
                u.name AS user_name,
                u.email AS user_email,
                p.title,
                p.content,
                p.image_url,
                p.created_at,
                p.updated_at
             FROM posts p
             INNER JOIN users u
                ON p.user_id = u.id
             WHERE p.id = ?`,
            [id]
        );

        if (posts.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        res.json({
            success: true,
            post: posts[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ========================================
// GET MY POSTS
// ========================================
exports.getMyPosts = async (req, res) => {
    try {

        const userId = req.user.id;

        const [posts] = await db.execute(
            `SELECT
                id,
                user_id,
                title,
                content,
                image_url,
                created_at,
                updated_at
             FROM posts
             WHERE user_id = ?
             ORDER BY created_at DESC`,
            [userId]
        );

        res.json({
            success: true,
            count: posts.length,
            posts
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ========================================
// UPDATE POST
// ========================================
exports.updatePost = async (req, res) => {
    try {

        const userId = req.user.id;
        const postId = req.params.id;

        const {
            title,
            content,
            image_url
        } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required"
            });
        }

        // Check post ownership
        const [posts] = await db.execute(
            `SELECT id
             FROM posts
             WHERE id = ?
             AND user_id = ?`,
            [postId, userId]
        );

        if (posts.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Post not found or you are not the owner"
            });
        }

        await db.execute(
            `UPDATE posts
             SET title = ?,
                 content = ?,
                 image_url = ?
             WHERE id = ?
             AND user_id = ?`,
            [
                title,
                content,
                image_url || null,
                postId,
                userId
            ]
        );

        res.json({
            success: true,
            message: "Post updated successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// ========================================
// DELETE POST
// ========================================
exports.deletePost = async (req, res) => {
    try {

        const userId = req.user.id;
        const postId = req.params.id;

        const [result] = await db.execute(
            `DELETE FROM posts
             WHERE id = ?
             AND user_id = ?`,
            [postId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Post not found or you are not the owner"
            });
        }

        res.json({
            success: true,
            message: "Post deleted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};