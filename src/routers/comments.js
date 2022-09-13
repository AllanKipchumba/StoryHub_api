const express = require("express");
const router = new express.Router();
const Comment = require("../models/comments");
const auth = require("../middleware/auth");
const Post = require("../models/posts");

router
    .route("/:id/comment")
    //add a comment to a post
    .post(auth, async(req, res) => {
        try {
            // get post id
            const id = req.params.id;
            //create a comment
            const comment = new Comment({
                userID: req.user._id,
                text: req.body.comment,
                post: id,
            });
            // save comment
            await comment.save();

            // get this particular post with a new comment
            const commentedPost = await Post.findById(id);
            // make the post aware of the new comment
            commentedPost.comments.push(comment);
            //save the post to update the new comment
            await commentedPost.save();

            res.status(201).send();
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
                post: `${post_id}`,
            });
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
            await Comment.findByIdAndDelete(comment_id);
            res.status(204).send();
        } catch (error) {
            res.status(500).send(`Error: ${error}`);
        }
    });

module.exports = router;