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
        } catch (error) {
            res.status(400).send(`Error: ${error}`);
            console.log(error);
        }
    })
    // fetch all posts
    .get(async(req, res) => {
        const authorName = req.query.author;
        try {
            let posts;
            // pagination && sorting
            const limitValue = req.query.limit || 10;
            const skipValue = req.query.skip || 0;

            // filter posts by authorname
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
            } else {
                posts = await Post.find().limit(limitValue).skip(skipValue).sort({
                    createdAt: -1,
                });
            }

            res.status(200).send(posts);
        } catch (error) {
            res.status(500).send(`Error: ${error}`);
        }
    });

router
    .route("/:id")
    //fetch a particular post
    .get(async(req, res) => {
        //get post id
        const _id = req.params.id;
        try {
            const post = await Post.findOne({ _id });

            // get the author of the post
            const owner_id = post.owner;
            const owner = await User.findById(owner_id);
            //access outhor's email address
            email = owner.email;
            // create userName from email address
            userName = email.substring(0, email.indexOf("@"));
            //set post owner to username
            const postOwner = userName;

            if (!post) {
                return res.status(404).send();
            }
            // send post and postOwner
            res.status(200).send({ post, postOwner });
        } catch (error) {
            res.status(400).send(`Error: ${error}`);
        }
    })
    //update a post
    .patch(auth, async(req, res) => {
        //Get keys of objects send through req.body as an array
        const updates = Object.keys(req.body);
        const allowedUpdates = ["title", "description", "imageURL", "category"];
        // User can only update the fields tittle and description.
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
                console.log(`no such post`);
                return res.status(404).send();
            }

            updates.forEach((update) => (post[update] = req.body[update]));

            await post.save();
            res.send(post);
        } catch (error) {
            res.status(400).send(error);
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
            await Comment.deleteMany({ postID: req.params.id });

            if (!post) {
                return res.status(404).send();
            }
            res.status(204).send(post);
        } catch (error) {
            res.status(500).send(`Error: ${error}`);
        }
    });

module.exports = router;