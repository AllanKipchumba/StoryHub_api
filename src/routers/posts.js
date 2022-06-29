const express = require("express");
const router = new express.Router();
const Post = require("../models/posts");
const auth = require("../middleware/auth");

// chained route handlers
router
    .route("/posts")
    .post(auth, async(req, res) => {
        const post = new Post({
            ...req.body,
            owner: req.user._id,
        });
        try {
            await post.save();
            res.status(201).send(post);
        } catch (e) {
            res.send(`Error: ${e}`);
        }
    })
    // fetch all posts
    .get(async(req, res) => {
        try {
            const posts = await Post.find();
            res.send(posts);
        } catch (err) {
            res.status(500).send(`Error: ${err}`);
        }
    });

// GET /tasks?limit=10&skip=10
// GET /tasks?sortBy=createdAt_asc
router.route("/myPosts").get(auth, async(req, res) => {
    const sort = {};

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(":");
        sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    }

    try {
        // populate all posts associated with this user
        await req.user.populate({
            path: "posts",
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort,
            },
        });
        res.send(req.user.posts);
    } catch (e) {
        res.status(500).send(`Error: ${e}`);
    }
});

router
    .route("/posts/:id")
    .get(auth, async(req, res) => {
        const _id = req.params.id;

        try {
            const post = await Post.findOne({ _id, owner: req.user._id });

            if (!post) {
                return res.status(404).send();
            }
            res.send(post);
        } catch (e) {
            res.status(500).send(`Error: ${e}`);
            console.log(e);
        }
    })
    .patch(auth, async(req, res) => {
        const updates = Object.keys(req.body);
        const allowedUpdates = ["title", "description"];
        const isValidOperation = updates.every((update) =>
            allowedUpdates.includes(update)
        );

        if (!isValidOperation) {
            return res.status(400).send({ Error: "Invalid updates!" });
        }
        try {
            const post = await Post.findOne({
                _id: req.params.id,
                owner: req.user._id,
            });

            if (!post) {
                return res.status(404).send();
            }

            updates.forEach((update) => (post[update] = req.body[update]));

            await post.save();
            res.send(post);
        } catch (e) {
            res.status(400).send(e);
        }
    })
    .delete(auth, async(req, res) => {
        try {
            const post = await Post.findOneAndDelete({
                _id: req.params.id,
                owner: req.user._id,
            });

            if (!post) {
                return res.status(404).send();
            }
            res.send(post);
        } catch (e) {
            res.status(500).send(`Error: ${e}`);
        }
    });

module.exports = router;