const express = require("express");
const router = new express.Router();
const Post = require("../models/posts");
const auth = require("../middleware/auth");

//like a post
router.route("/:id/like").put(auth, async(req, res) => {
    try {
        const postID = req.params.id;
        const userID = req.user._id;

        const post = await Post.findById(postID);

        //check if user alread liked the post
        const userLikedPost = post.likes.includes(userID);

        if (userLikedPost) {
            res.status(409).send("Already liked post");
        } else {
            const likePost = await Post.findByIdAndUpdate(
                postID, {
                    $push: { likes: userID },
                }, { new: true }
            );
            res.status(201).send(likePost);
        }
    } catch (error) {
        res.status(500).send(`Error: ${error}`);
    }
});

//unlike a post
router.route("/:id/unlike").put(auth, async(req, res) => {
    try {
        const postID = req.params.id;
        const userID = req.user._id;

        const unlikePost = await Post.findByIdAndUpdate(
            postID, {
                $pull: { likes: userID },
            }, { new: true }
        );

        res.status(204).send(unlikePost);
    } catch (error) {
        res.status(500).send(`Error: ${error}`);
    }
});

module.exports = router;