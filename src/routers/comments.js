const express = require("express");
const router = new express.Router();
const Comment = require("../models/comments");
const auth = require("../middleware/auth");
const Post = require("../models/posts");

router.route("/:id/comment").post(auth, async(req, res) => {
    try {
        // find out which post you are commenting
        const id = req.params.id;
        // get the comment text and record post id
        const comment = new Comment({
            text: req.body.comment,
            post: id,
        });
        // save comment
        await comment.save();

        // get this particular post
        const commentedPost = await Post.findById(id);
        // push the comment into the post.comments array
        commentedPost.comments.push(comment);
        //save
        await commentedPost.save();
        //access comment from Comment model
        const comments_array = commentedPost.comments;

        if (comments_array === 0) {
            return res.status(404).send();
        }

        //loop through each comment array and return comment
        comments_array.map(async(comment) => {
            //stringify the array
            const comment_id = comment.toString();
            //access comment from db
            const comment_text = await Comment.findById(comment_id);
            // console.log(comment_text.text);
            const { text } = comment_text;
            console.log(text);
        });
        res.status(200).send();
    } catch (error) {
        res.status(500).send(`Error: ${error}`);
        console.log(error);
    }
});

module.exports = router;