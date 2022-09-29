const express = require("express");
const router = new express.Router();
const Comment = require("../models/comments");
const auth = require("../middleware/auth");
const User = require("../models/user");

router
    .route("/:id")
    //add a comment to a post
    .post(auth, async(req, res) => {
        try {
            // get post id
            const id = req.params.id;
            // get the name of author of comment
            const authorProfile = await User.findById(req.user._id);
            const { username } = authorProfile;

            //create a comment
            const comment = new Comment({
                authorName: username,
                postID: id,
                comment: req.body.comment,
            });
            // save comment
            await comment.save();

            res.status(201).send(comment);
        } catch (error) {
            res.status(500).send(`Error: ${error}`);
        }
    })
    //access comments on a post
    .get(auth, async(req, res) => {
        try {
            //get post id
            const post_id = req.params.id;
            //query for all comments associated with that post
            const comments = await Comment.find({
                postID: post_id,
            }).sort({ createdAt: -1 });

            //send comments to client
            res.status(200).send(comments);
        } catch (error) {
            res.status(500).send(`Error: ${error}`);
        }
    })
    //delete a comment
    .delete(auth, async(req, res) => {
        try {
            //get comment id
            const comment_id = req.params.id;
            if (!comment_id) {
                throw new Error();
            }
            //query comment in db and delete
            await Comment.findByIdAndDelete(comment_id);
            res.status(204).send();
        } catch (error) {
            res.status(500).send(`Error: ${error}`);
        }
    });

//like comment

router.route("/likeComment").put(auth, async(req, res) => {
    try {
        const commentID = req.body.commentID;
        const userID = req.user._id;

        //find this comment
        const comment = await Comment.findById(commentID);

        //check if user has liked comment
        const userLikedComment = comment.likes.includes(userID);

        if (userLikedComment) {
            res.status(409).send("Already liked comment");
        } else {
            const likeComment = await Comment.findByIdAndUpdate(
                commentID, {
                    $push: { likes: userID },
                }, { new: true }
            );
            res.status(201).send(likeComment);
        }
    } catch (error) {
        res.status(500).send(`Error: ${error}`);
    }
});

//get number likes on a comment
router.route("/Likes").get(async(req, res) => {
    try {
        const commentID = req.body.commentID;
        //find this comment
        const comment = await Comment.findById(commentID);

        if (!comment) {
            return res.status(404).send("No such comment found");
        }
        //convert likes to string
        //.send() method does not send intergers
        likes = comment.likes.length.toString();
        // send the number of likes on a comment
        res.status(200).send(likes);
    } catch (error) {
        console.log(error);
        res.status(500).send(`Error: ${error}`);
    }
});

module.exports = router;