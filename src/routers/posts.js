const express = require("express");
const router = new express.Router();
const Post = require("../models/posts");
const auth = require("../middleware/auth");
const User = require("./../models/user");
const Comment = require("../models/comments");

// chained route handlers
router
    .route("/")
    //create a post
    .post(auth, async(req, res) => {
        try {
            const post = new Post({
                ...req.body,
                owner: req.user._id,
            });

            await post.save();
            res.status(201).send(post);
        } catch (e) {
            res.send(`Error: ${e}`);
        }
    })
    // fetch all posts
    .get(async(req, res) => {
        const authorName = req.query.author;
        const categoryName = req.query.cat;
        try {
            let posts;
            // pagination && sorting
            const limitValue = req.query.limit || 10;
            const skipValue = req.query.skip || 0;

            if (authorName) {
                const author = await User.find({ username: authorName });
                if (!author) {
                    throw new Error();
                }
                const authorId = author[0]._id.toString();
                posts = await Post.find({ owner: authorId })
                    .limit(limitValue)
                    .skip(skipValue)
                    .sort({
                        createdAt: -1,
                    });
            } else if (categoryName) {
                posts = await Post.find({
                        categories: {
                            $in: [categoryName],
                        },
                    })
                    .limit(limitValue)
                    .skip(skipValue)
                    .sort({
                        createdAt: -1,
                    });
            } else {
                posts = await Post.find().limit(limitValue).skip(skipValue).sort({
                    createdAt: -1,
                });
            }

            res.send(posts);
        } catch (err) {
            res.status(500).send(`Error: ${err}`);
        }
    });

router
    .route("/:id")
    //fetch a particular post
    .get(async(req, res) => {
        const _id = req.params.id;
        try {
            const post = await Post.findOne({ _id });

            // access post-owner's username
            const owner_id = post.owner;
            const owner = await User.findById(owner_id);
            const postOwner = owner.username;

            if (!post) {
                return res.status(404).send();
            }
            // send post and postOwner
            res.send({ post, postOwner });
        } catch (e) {
            res.status(500).send(`Error: ${e}`);
            console.log(e);
        }
    })
    //update a post
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
    //delete a post
    .delete(auth, async(req, res) => {
        try {
            const post = await Post.findOneAndDelete({
                _id: req.params.id,
                owner: req.user._id,
            });
            //delete all comments associated with that post
            await Comment.deleteMany({ post: req.params.id });

            if (!post) {
                return res.status(404).send();
            }
            res.send(post);
        } catch (e) {
            res.status(500).send(`Error: ${e}`);
        }
    });

module.exports = router;