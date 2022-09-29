const express = require("express");
const router = new express.Router();
const Post = require("../models/posts");
const auth = require("../middleware/auth");

//like a post
router.route("/:id/like").put(auth, async(req, res) => {
    try {
        const postID = req.params.id;
        const userID = req.user._id;

        //query this post in db
        const post = await Post.findById(postID);

        //check if this user has already liked this post
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

        const post = await Post.findById(postID);

        //check if this user has liked the post
        const userLikedPost = post.likes.includes(userID);

        if (!userLikedPost) {
            res.status(409).send("You have not liked the post");
        } else {
            const unlikePost = await Post.findByIdAndUpdate(
                postID, {
                    $pull: { likes: userID },
                }, { new: true }
            );
            res.status(204).send(unlikePost);
        }
    } catch (error) {
        res.status(500).send(`Error: ${error}`);
    }
});
//get number of likes on a post
router.route("/:id/likes").get(async(req, res) => {
    try {
        const postID = req.params.id;
        //get this post in db
        const post = await Post.findById(postID);

        if (!post) {
            return res.status(404).send("No such post found");
        }
        //likes are stored in an array. convert array length to string
        //.send() method does not send intergers
        likes = post.likes.length.toString();
        // send the number of likes on a post
        res.status(200).send(likes);
    } catch (error) {
        res.status(500).send(`Error: ${error}`);
    }
});

module.exports = router;